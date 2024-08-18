const config = require("./config").getHardwareInfo();
const os = require("node:os");

const symbols = {
  K: 2 ** 10,
  M: 2 ** 20,
  G: 2 ** 30,
};

const { MINIMUN_CPU, MAXIMUN_CPU, MINIMUN_RAM, MAXIMUN_RAM } = config.machine;

function convertToBytes(memory) {
  try {
    // memory: number part + symbol
    const [_, number, symbol] = memory.match(/(\d+)([A-Z]+)?/);
    const base = symbols[symbol] || 1;
    const bytes = Number(number) * base;
    return bytes;
  } catch (e) {
    return -1;
  }
}

function validateMemory(memory) {
  const bytes = convertToBytes(memory);
  return MINIMUN_RAM <= bytes && bytes <= MAXIMUN_RAM;
}

function validateCPU(cpus) {
  try {
    return MINIMUN_CPU <= Number(cpus) && Number(cpus) <= MAXIMUN_CPU;
  } catch (e) {
    return false;
  }
}

function validateApplication(application) {
  for (const container of ["backend", "database"]) {
    const { cpu, ram } = application[container];
    if (!validateCPU(cpu) || !validateMemory(ram)) {
      return false;
    }
  }

  return true;
}

module.exports = {
  validateApplication,
};
