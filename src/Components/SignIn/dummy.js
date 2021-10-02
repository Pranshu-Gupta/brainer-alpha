const { default: axios } = require('axios');

const onSubmitSignI = async () => {
  try {
    const response = await axios.post(
      'https://thawing-sierra-39693.herokuapp.com/signin',
      {
        email: 'pranshugupa2910@gmail.com',
        password: '',
      }
    );
    const user = response.data;
    if (user.id) {
      console.log(user.id);
    }
  } catch (error) {
    // console.log(error.response.status);
    if (error.response.status === 400) console.log('Invalid submission');
    else console.log('Error occurred while retrieving data!');
  }
};
// console.log('Hello');
onSubmitSignI();
