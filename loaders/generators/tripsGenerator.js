JG.repeat(50, 50, {
    _id: JG.objectId(),
  ticker: 'ticker',
    creator: JG.objectId(),
  title: JG.city(),
    description: JG.loremIpsum(),
  price: numeral(JG.floating(500, 2000, 2)).format('0.00'),
    requirements: JG.loremIpsum(),
    startDate: JG.date(),
    endDate: JG.date(),
    pictures:'',
    publicationDate: JG.date(),
    cancellationDate: null,
    cancellationReason: '',
    stages: [],
    sponsorships: []
  });
