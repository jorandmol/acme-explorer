JG.repeat(500, 500, {
    _id: JG.objectId(),
    name: JG.firstName(),
    surname: JG.lastName(),
    password: 'test1234',
    email() {
      return (
        _.snakeCase(this.name) +
        this.surname +
        '@' +
        'gmail.com'
      ).toLowerCase();
    },
    phone: '+43 634343434',
    address: `${JG.integer(1, 100)} ${JG.street()}, ${JG.city()}, ${JG.state()}`,
	role: JG.random('explorer', 'manager', 'sponsor', 'administrator'),
  	ban: null
});