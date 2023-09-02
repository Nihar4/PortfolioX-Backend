import app from "./app.js";
import { connectDB } from "./config/database.js";
import nodeCron from "node-cron";
import axios from "axios";
connectDB();

let part1, part2, part3, part4;
const getsymbols = async () => {
    const response = await axios.get('https://portfolio-x-two.vercel.app/api/v1/splitallstocks');
    part1 = response.data.part1;
    part2 = response.data.part2;
    part3 = response.data.part3;
    part4 = response.data.part4;
    // console.log(part1, part2, part3, part4);
    // console.log(response.data);
}
getsymbols();

let part1data = [], part2data = [], part3data = [], part4data = [];
nodeCron.schedule("0 0 0,4,8,12,16,20 * * *", async () => {
    try {
        console.log(part1);
        part1data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part1 });
        part1data = part1data.data.filteredLogoData;
    } catch (error) {
        console.log(error);
    }
});
nodeCron.schedule("0 0 1,5,9,13,17,21 * * *", async () => {
    try {
        console.log(part2)
        part2data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part2 });
        part2data = part2data.data.filteredLogoData;
    } catch (error) {
        console.log(error);
    }
});
nodeCron.schedule("0 0 2,6,10,14,18,22 * * *", async () => {
    try {
        console.log("hello3")
        part3data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part3 });
        part3data = part3data.data.filteredLogoData;
    } catch (error) {
        console.log(error);
    }
});
nodeCron.schedule("0 0 3,7,11,15,19,23 * * *", async () => {
    try {
        console.log("hello4")
        part4data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part4 });
        part4data = part4data.data.filteredLogoData;
    } catch (error) {
        console.log(error);
    }
});

nodeCron.schedule("0 50 3,7,11,15,19,23 * * *", async () => {
    try {
        console.log("hello")
        await axios.post('https://portfolio-x-two.vercel.app/api/v1/mergeAllStocks', { "part1data": part1data, "part2data": part2data, "part3data": part3data, "part4data": part4data });

    } catch (error) {
        console.log(error);
    }
});



app.listen(process.env.PORT, () => {
    console.log(`Server is working on port: ${process.env.PORT}`);
});
