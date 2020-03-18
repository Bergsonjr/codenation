require('dotenv').config()

const axios = require('axios')
const url = `https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${process.env.TOKEN}`

const init = async () => {
    try {
        const request = await axios.get(url)
        request.data.decifrado = decrypt(request.data.cifrado)
        console.log(request.data, 'request data')
    }
    catch (error) {
        console.log(error)
    }
}

const decrypt = crypt => {
    let newString = ''
    for (let i = 0; i < crypt.length; i++) {
        let ascii = crypt[i].charCodeAt()
        if (ascii > 64 && ascii < 122) { // A - z
            console.log('entrei no if por', crypt[i])
            newString += String.fromCharCode(++ascii)
        }
        else {
            console.log('entrei no else por', crypt[i])
            newString += crypt[i]
        }
    }
    return newString
}

init()