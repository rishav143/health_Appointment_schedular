import express from "express";
import bodyParser from "body-parser";
import path from "path";
import qr from "qr-image";
import fs from "fs"
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');


//API middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//API routes
app.get('/form', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/public/index.html'));
})

// Handle form submission
app.post('/submit-appointment', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const gender = req.body.gender;
    const bloodGroup = req.body.bloodGroup;
    const appointmentDate = req.body.appointmentDate;
    

    const url = firstName+lastName+phoneNumber;
    var qr_svg = qr.image(url);
    qr_svg.pipe(fs.createWriteStream('./public/url_img.png'));

    fs.writeFile("URL.txt", url, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

    console.log('Form Data:', { firstName, lastName, gender, bloodGroup, appointmentDate })
    res.render('thankyou', { firstName, lastName, gender, bloodGroup, appointmentDate});

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
