JG.repeat(1000, 1000, {
  _id: JG.objectId(),
  explorer: JG.objectId(), // this are not valid explorer ids, you need to create a list of valid explorer ids
  trip: JG.objectId(),  // this are not valid trip ids, you need to create a list of valid trip ids
  status: JG.random('pending', 'rejected', 'due', 'accepted', 'cancelled'),
  cancellationDate() {
    return (
      this.status === 'cancelled' ? JG.date(new Date(2020, 0, 1), new Date(2023, 0, 2)) : null);
  },
  paidAt() {
    return (
      this.status === 'accepted' ? JG.date(new Date(2020, 0, 1), new Date(2023, 0, 2)) : null);
  },
  rejectionReason() {
    return (
      this.status === 'rejected' ? JG.random(
        'The payment period has ended',
        'The explorer denies to pay',
        'The explorer is no longer interested in this trip'
      ) : null);
  },
  comments: JG.random(
    null,
    'I am very interested in this trip, it is a place I have never visited',
    'The first time I was there I fell in love with that city, I can\'t wait to go back',
    'I have to take this opportunity to visit this place. It\'s now or never!'
  ),
});