const howls = require('./howls.json');

module.exports = {
  getHowls: () => {
    return new Promise((resolve, reject) => {
      resolve(howls);
    });
  },
	createHowl: (message, userId, datetime) => {
		return new Promise((resolve, reject) => {
			const newHowl = {
				id: howls.length + 1,
				userId: userId,
				datetime: datetime,
				text: message
			};
			howls.push(newHowl);
			resolve(newHowl);
		});
	},
	getHowlsByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const userHowls = howls.filter(howl => howl.userId === userId);
      resolve(userHowls);
    });
  }
};