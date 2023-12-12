const express = require('express');
const multer = require('multer');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const user = require('../models/user');
const router = express.Router();
 
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Extension no valida");
        if(isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '//' + req.get("host");
    const newPassword = randomstring.generate({ length: 10, charset: 'numeric' });
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        admin: req.body.admin,
        imagePath: url + "/image/" + req.file.filename,
        claveTemp: newPassword
    });
    user.save().then(createdPost => {
        res.status(201).json({
            message: 'User Added Successfully',
            post: {
                ...createdPost._doc,
                id: createdPost._id
            }
        });
    });
    enviarMail = async () => {
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'torresliset12@gmail.com',
                pass: 'wzfs dftt fkoq tzje'
            }
        };

        const mensaje = {
            from: 'torresliset12@gmail.com',
            to: req.body.email,
            subject: 'Creacion de Cuenta',
            text: (newPassword + 'es tu codigo de acceso en caso de olvidar tu contraseña alguna vez')
        };

        const transport = nodemailer.createTransport(config);

        const info = await transport.sendMail(mensaje);

        console.log(info);
    }
    enviarMail();
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email, password: password }).then(user => {
        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
        }

        return res.status(200).json({ success: true, message: 'Authentication successful', user: user });
    }).catch(error => {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
});

router.post('/reset-password', (req, res, next) => {
    const email = req.body.email;
  
    const newPassword = randomstring.generate({ length: 10, charset: 'numeric' });
  
    User.findOne({ email: email }).then(user => {
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.password = newPassword;
  
      user.save().then(updatedUser => {

        enviarMail = async () => {
            const config = {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'torresliset12@gmail.com',
                    pass: 'wzfs dftt fkoq tzje'
                }
            };

            const mensaje = {
                from: 'torresliset12@gmail.com',
                to: email,
                subject: 'Recuperacion de Contraseña',
                text: ('Tu codigo de acceso con el que puedes entrar a Cono-C es: ' + newPassword + '. Una vez que ingreses puedes cambiarla en cualquier momento.')
            };

            const transport = nodemailer.createTransport(config);

            const info = await transport.sendMail(mensaje);

            console.log(info);
        }

        enviarMail();
  
        res.status(200).json({
          success: true,
          message: 'Password reset successful. New password sent to user email.',
          newPassword: newPassword
        });
      });
    }).catch(error => {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
  });

router.get('', (req, res, next) => {
    User.find().then(datosDB => {
        res.status(200).json({
            message: "Usuarios expuestos con éxito",
            posts: datosDB
        });
    });
});

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id).then(user => {
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'Post no encontrado'});
        }
    })
});

router.put('/:id', (req, res, next) => {
    const user = {
        _id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        admin: req.body.admin,
        imagePath: req.body.imagePath,
        claveTemp: req.body.claveTemp
    };

    User.updateOne({ _id: req.params.id }, user).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    });
});

router.delete('/:id', (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
    .then(result => {
        console.log(result);
        res.status(200).json({ message: 'Usuario eliminado' });
    });
});

module.exports = router;