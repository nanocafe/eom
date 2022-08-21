const { TunedBigNumber, toRaws } = require('./convert')
const path = require('path')
const fs = require('fs')

const config = require(path.join(__dirname, '../../../config.json'));

const MIN_AMOUNT = toRaws(config.minAmount)

const { createBlock } = require("./block")
const { getWork } = require("./work")
const rpc = require("../rpc");

const { getAccountInfo, updateAccountInfo, getPrivateKey } = require('../accounts_manager.js')


function cacheWork(hash, type, account, accountInfo) {
    return new Promise((resolve, reject) => {
        getWork(hash, type)
            .then((work) => {
                console.info("Next work pre-cached!")
                // Save current work
                accountInfo.work = work
                updateAccountInfo(account, accountInfo)
                resolve(work)
            })
            .catch((err) => {
                console.info("Error pre-caching...")
                reject(err)
            })
    })
}

function syncAccount(account) {
    console.log("syncing account " + account)
    return new Promise((resolve, reject) => {
        const accountInfo = getAccountInfo(account)
        rpc.account_info(account)
            .then((res) => {
                accountInfo.pending = res.pending
                accountInfo.frontier = res.frontier
                accountInfo.representative = res.representative
                accountInfo.totalReceived = res.total_received
                accountInfo.totalSent = res.total_sent
                accountInfo.pendingValid = res.pending_valid
                updateAccountInfo(account, accountInfo)
                resolve()
            })
            .catch((err) => reject(err))
    })
}

function receive(blockHash, account, amount) {
    console.info("receiving...")
    return new Promise((resolve, reject) => {

        let accountInfo = getAccountInfo(account)

        const newBalance = TunedBigNumber(accountInfo.balance).plus(amount).toString(10)

        const privateKey = getPrivateKey(account)

        // Creates Receive Block
        let receiveBlock = createBlock({
            account: account,
            balance: newBalance,
            link: blockHash,
            previous: accountInfo.frontier,
            representative: config.representative,
        }, privateKey)

        // Generate PoW
        let pow_block_target = accountInfo.frontier
        if (accountInfo.frontier == "0000000000000000000000000000000000000000000000000000000000000000") {
            pow_block_target = accountInfo.publicKey
        }
        getWork(pow_block_target, "receive")
            .then((work) => {
                receiveBlock.block.work = work

                // Save current work, helps if broadcast fails
                accountInfo.work = work
                updateAccountInfo(account, accountInfo)

                // Broadcast block
                rpc.broadcast(receiveBlock.block)
                    .then((res) => {

                        // Update account info
                        accountInfo.pending = TunedBigNumber(accountInfo.pending).minus(amount)
                        accountInfo.balance = newBalance
                        accountInfo.frontier = res.hash
                        accountInfo.totalReceived = TunedBigNumber(accountInfo.totalReceived).plus(amount).toString(10)
                        updateAccountInfo(account, accountInfo)
                        //cacheWork(receiveBlock.hash, "all", account, accountInfo)
                        resolve({ hash: receiveBlock.hash, amount: amount })
                    })
                    .catch((err) => {
                        // If fork, reload frontier and try again
                        if ("error" in err && err.error.includes("Fork")) {
                            syncAccount(account)
                                .then((res) => {
                                    receive(blockHash, account, amount)
                                        .then((res) => resolve(res))
                                        .catch((err) => resolve(err))
                                })
                                .catch((err) => reject(err))
                        } else {
                            reject("Error broadcasting: " + JSON.stringify(err))
                        }
                    })
            })
            .catch((err) => {
                reject("Error in Proof of Work: " + JSON.stringify(err))
            })
    })
}

function send(account, destination, amount) {
    console.log("sending...")

    let accountInfo = getAccountInfo(account)
    const privateKey = getPrivateKey(account)

    return new Promise((resolve, reject) => {
        const newBalance = TunedBigNumber(accountInfo.balance).minus(amount).toString(10)

        // Creates Send Block
        const sendBlock = createBlock({
            account: account,
            balance: newBalance,
            linkAsAccount: destination,
            previous: accountInfo.frontier,
            representative: config.representative,
        }, privateKey)

        // Generate PoW
        getWork(accountInfo.frontier, "all")
            .then((work) => {
                sendBlock.block.work = work
                rpc.broadcast(sendBlock.block)
                    .then((res) => {
                        accountInfo.balance = newBalance
                        accountInfo.frontier = sendBlock.hash
                        accountInfo.totalSent = TunedBigNumber(accountInfo.totalSent).plus(amount).toString(10)
                        updateAccountInfo(account, accountInfo)
                        cacheWork(sendBlock.hash, "receive", account, accountInfo)
                        resolve({ hash: sendBlock.hash, amount: amount })
                    })
                    .catch((err) => {
                        // If fork, reload frontier and try again
                        if ("error" in err && err.error.includes("Fork")) {
                            syncAccount(account)
                                .then((res) => {
                                    send(account, destination, amount)
                                        .then((res) => resolve(res))
                                        .catch((err) => resolve(err))
                                })
                                .catch((err) => reject(err))
                        } else {
                            reject("Error broadcasting: " + JSON.stringify(err))
                        }
                    })
            })
            .catch((err) => {
                reject("Error in Proof of Work: " + JSON.stringify(err))
            })
    })
}

//Reads the entire history to allow extra information: total_received, total_sent, pending_valid
function balanceHistory(account) {
    let amount, pendingBlocks = {}, pending_valid = 0, total_received = "0", total_sent = "0"
    return new Promise((resolve, reject) => {
        rpc.account_history(account, {
            raw: true,
            reverse: true
        })
            .then((history) => {
                rpc.pending_blocks(account, MIN_AMOUNT)
                    .then((pendings) => {

                        // Get only valid pending balance (all-tx-amount => MIN_AMOUNT)
                        for (let blockHash in pendings) {
                            amount = pendings[blockHash]
                            pending_valid = TunedBigNumber(pending_valid).plus(amount).toString(10)
                            pendingBlocks[blockHash] = amount
                        }

                        if (history != "") {
                            history.forEach((block) => {
                                if (block.subtype == "receive") total_received = TunedBigNumber(total_received).plus(block.amount).toString(10)
                                if (block.subtype == "send") total_sent = TunedBigNumber(total_sent).plus(block.amount).toString(10)
                            })
                            resolve({ balance: history[0].balance, pending_valid: pending_valid, pending_blocks: pendingBlocks, total_received: total_received, total_sent: total_sent })
                        } else {
                            // Unopened Account
                            resolve({ balance: 0, total_received: total_received, total_sent: total_sent, pending_valid: pending_valid, pending_blocks: pendingBlocks })
                        }
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}

module.exports = {
    send,
    receive,
    balanceHistory,
    syncAccount,
    cacheWork
}