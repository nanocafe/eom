import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Layout from "components/Layout";
import api from "services/api";
import { useEffect, useState } from "react";
import LeaderBoard from "components/Leaderboard";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import Button from "components/Button";
import {
  ENTRY_FEE,
  ENTRY_FEE_RAWS,
  FEE_POOL_ALLOCATION,
  isLocked,
} from "config/config";
import { getCurrentMonthName, toFixedSafe } from "utils";
import { TunedBigNumber } from "utils/nano";
import { convert, Unit } from "nanocurrency";
import BigNumber from "bignumber.js";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

const DEFAULT_PAGINATION_LIMIT = 10;
const CURRENT_MONTH_BASE_REWARD = 56.84;

export default function Home() {
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleNotificationClick = () => {
    setShowModal(true);
  };

  const {
    data: guesses,
    isLoading,
    refetch,
  } = useQuery(["guesses"], () =>
    api.get(`/guesses?page=${currentPage}&limit=${limit}`)
  );

  useEffect(() => {
    refetch();
  }, [currentPage, limit]);

  const base_reward_raws = convert(CURRENT_MONTH_BASE_REWARD.toString(), {
    from: Unit.NANO,
    to: Unit.raw,
  });
  let acumulated_fees =
    guesses?.values?.reduce((acc: BigNumber, guess: any) => {
      const feeToAllocate =
        TunedBigNumber(ENTRY_FEE_RAWS).multipliedBy(FEE_POOL_ALLOCATION);
      return acc.plus(feeToAllocate);
    }, TunedBigNumber(0)) || TunedBigNumber(0);
  const reward_raws = TunedBigNumber(base_reward_raws)
    .plus(acumulated_fees)
    .toString();
  const reward = toFixedSafe(
    convert(reward_raws, { from: Unit.raw, to: Unit.NANO }),
    3
  );

  return (
    <Layout
      navbarOption={
        !isLocked() ? (
          <Link href="/enter">
            <a>
              <Button
                style={{
                  width: "150px",
                }}
              >
                <LockOpenIcon className="w-5 h-5 mr-2" />
                Enter Now
              </Button>
            </a>
          </Link>
        ) : (
          <Button
            style={{
              width: "130px",
            }}
            disabled
          >
            <LockClosedIcon className="w-5 h-5 mr-2" />
            LOCKED
          </Button>
        )
      }
    >
      <main className="p-2">
        <div className="relative items-center">
          <button
            className="mt-4 mr-4 text-gold/80 hover:text-gold"
            onClick={handleNotificationClick}
          >
            <InformationCircleIcon className="h-8 w-8" />
            <span>How to play?</span>
          </button>
        </div>
        <div
          id="prize-banner"
          className="w-full flex justify-center pb-2 sm:pt-2"
        >
          <div className="flex flex-col items-center">
            <h5 className="text-sm sm:text-lg">
              {getCurrentMonthName()} 2023 EOM Reward
            </h5>
            <h3
              className="text-2xl sm:text-3xl font-bold"
              style={{
                textShadow: "0 0 5px #e2b731",
              }}
            >
              {reward} XNO
            </h3>
            <div className="text-gray-300 mt-1 flex space-x-4">
              <span>________</span>{" "}
              <img src="/icons/laurel.png" className="-mt-2 w-12 sm:w-16" />{" "}
              <span>________</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <LeaderBoard
            total={guesses?.total || 0}
            guesses={guesses?.values || []}
            isLoading={isLoading}
            limit={limit}
            currentPage={currentPage}
            onLimitChange={setLimit}
            onPageChange={setCurrentPage}
          />

          <div className="w-full flex justify-between space-x-12 py-4 mt-8">
            <Link href="/faq">
              <a className="px-2 py-1 text-gold/80 hover:text-gold border border-gold/70 hover:border-gold hover:shadow rounded">
                EOM FAQ
              </a>
            </Link>

            <Link href="/transparency">
              <a className="px-2 py-1 text-gold/80 hover:text-gold border border-gold/70 hover:border-gold hover:shadow rounded">
                TRANSPARENCY
              </a>
            </Link>
          </div>
          {showModal && (
            <div
              className="fixed z-10 inset-0 overflow-y-auto"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  aria-hidden="true"
                ></div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                        {" "}
                        <InformationCircleIcon className="h-8 w-8 text-yellow-600" />
                      </div>

                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-title"
                        >
                          How do you play EOM?
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You have to make a guess at what the price of XNO
                            will be on the final day of the month, though before
                            you can enter the contest, make sure you have either
                            nanobyte (desktop) or nautilus (mobile) installed.
                          </p>
                          <br />
                          <p className="text-sm text-gray-500">
                            You can submit this guess by clicking the "Enter"
                            button. This will take you to the submit screen.
                            <br />
                            <br />
                            Then begin pasting your XNO reward address, your
                            guess price and a name. After you do this, a pop-up
                            will allow you to confirm your entry fee or Ask for
                            permission to open Nautilus wallet to confirm the
                            entry fee.
                          </p>
                          <br />
                          <p className="text-sm text-gray-500">
                            After the contest is locked, you wait till the final
                            day of the month - if then you had the closest or
                            exact price, you win the reward!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gold text-base font-medium text-white hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-dark sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleModalClose}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <script src="/head.js" />
    </Layout>
  );
}
