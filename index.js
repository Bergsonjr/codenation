require('dotenv').config()

const fs = require('fs')
const crypto = require('crypto')
const request = require('request')
const urlToGet = `https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${process.env.TOKEN}`
const urlToPost = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${process.env.TOKEN}`

const main = () => {
    try {
        get()
        post()
    }
    catch (error) {
        console.log(error, 'error')
    }
}

const get = () => {
    request({
        url: urlToGet
    }, (err, response, body) => {
        const result = JSON.parse(body)
        result.decifrado = decrypt(result.cifrado)
        result.resumo_criptografico = encrypt(result.decifrado) // sha1

        fs.writeFileSync('answer.json', JSON.stringify(result))
        console.log(result, 'data')
    })
}

const post = () => {
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    const r = request.post(
        { url: urlToPost, headers },
        (err, httpResponse, body) => {
            if (err) {
                return console.error('upload failed:', err)
            }
            console.log('Upload successful!  Server responded with:', body)
        }
    )
    const form = r.form()
    form.append('answer', fs.createReadStream('answer.json'), {
        filename: 'answer.json'
    })
}

const encrypt = decrypt => {
    const shasum = crypto.createHash('sha1');
    shasum.update(decrypt)
    return shasum.digest('hex')
}

const decrypt = crypt => {
    let newString = ''
    for (let i = 0; i < crypt.length; i++) {
        let ascii = crypt[i].charCodeAt()
        if (ascii > 64 && ascii < 122) { // A - z
            newString += String.fromCharCode(--ascii)
        }
        else {
            newString += crypt[i]
        }
    }
    return newString
}

main()