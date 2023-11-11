function statement(invoice, plays) {
  const totalAmount = calculateTotalAmount(invoice, plays);
  const volumeCredits = calculateVolumeCredits(invoice, plays);
  const PLAY_TYPES = {
  TRAGEDY: "tragedy",
  COMEDY: "comedy",
};

  return formatResult(invoice.customer, totalAmount, volumeCredits);
}

function calculateTotalAmount(invoice, plays) {
  let totalAmount = 0;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = calculatePerformanceAmount(play, perf);

    totalAmount += thisAmount;
  }

  return totalAmount;
}

function calculatePerformanceAmount(play, perf) {
  let thisAmount = 0;

  switch (play.type) {
    case PLAY_TYPES.TRAGEDY:
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case PLAY_TYPES.COMEDY:
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }

  return thisAmount;
}

function calculateVolumeCredits(invoice, plays) {
  let volumeCredits = 0;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];

    volumeCredits += Math.max(perf.audience - 30, 0);
    if (PLAY_TYPES.COMEDY === play.type) volumeCredits += Math.floor(perf.audience / 5);
  }

  return volumeCredits;
}

function formatResult(customer, totalAmount, volumeCredits) {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  let result = `Statement for ${customer}\n`;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = calculatePerformanceAmount(play, perf);

    result += `  ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
}

console.log(statement(invoices[0], plays));
