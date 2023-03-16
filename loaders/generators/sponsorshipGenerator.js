JG.repeat(100, 100, {
    _id: JG.objectId(),
  sponsor: JG.objectId(),
    banner: JG.loremIpsum(),
  link: 'example.com',
  financedAmount: numeral(JG.floating(1000, 4000, 2)).format('0.00'),
  paidAt: JG.date(),
  });