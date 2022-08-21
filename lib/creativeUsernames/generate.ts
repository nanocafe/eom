'use strict';

const data = {
    names: require('./names.json'),
    adjectives: require('./adjectives.json')
}
let seperator = '-'

function setNames(names : string[]) {
    data.names = names
};

function setAdjectives(adjectives : string[]) {
    data.adjectives = adjectives
};

function setSeperator(new_seperator : string) {
    seperator = new_seperator
};

function generate() : string {
    const ran_a = Math.floor(Math.random() * data.names.length)
    const ran_b = Math.floor(Math.random() * data.adjectives.length)
    const ran_suffix = Math.floor(Math.random() * 100)
    return `${data.adjectives[ran_b]}${seperator}${data.names[ran_a]}${ran_suffix}`
};

export {
    setNames,
    setAdjectives,
    setSeperator,
    generate
}
