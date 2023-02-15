JG.repeat(1000, 1000, {
  _id: JG.objectId(),
  name: JG.firstName(),
  surname: JG.lastName(),
  password: JG.guid(),
  email() {
    return (
      _.snakeCase(this.name) +
      this.surname +
      '@' +
      'gmail.com'
    ).toLowerCase();
  },
  phone: `+${JG.integer(1, 999)} ${JG.integer(100000000, 999999999)}`,
  address: `${JG.integer(1, 100)} ${JG.street()}, ${JG.city()}, ${JG.state()}`,
  role: JG.random('explorer', 'manager', 'sponsor', 'administrator'),
  ban: JG.random(
    null,
    {
      date: JG.date(new Date(2022, 0, 1)),
      reason: JG.random('Bad use', 'Bad language', 'Fraud', 'Spam')
    }
  )
});