JG.repeat(100, 100, {
    _id: JG.objectId(),
  title: JG.city(),
    description: JG.loremIpsum(),
  price: numeral(JG.floating(100, 8000, 2)).format('0.00'),
  });