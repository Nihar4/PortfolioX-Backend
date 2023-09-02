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
nodeCron.schedule("0 30 */2 * * *", async () => {
    try {
        console.log(part1);
        part1data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part1 });
        console.log(part1data)
    } catch (error) {
        console.log(error);
    }
});
nodeCron.schedule("0 35 */2 * * *", async () => {
    try {
        console.log(part2)
        part2data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part2 });

    } catch (error) {
        console.log(error);
    }
});
nodeCron.schedule("0 40 */2 * * *", async () => {
    try {
        console.log("hello")
        part3data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part3 });

    } catch (error) {
        console.log(error);
    }
});
nodeCron.schedule("0 45 */2 * * *", async () => {
    try {
        console.log("hello")
        part4data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part4 }).filteredLogoData;

    } catch (error) {
        console.log(error);
    }
});

nodeCron.schedule("0 50 */2 * * *", async () => {
    try {
        console.log("hello")
        await axios.post('https://portfolio-x-two.vercel.app/api/v1/mergeAllStocks', { part1data, part2data, part3data, part4data });

    } catch (error) {
        console.log(error);
    }
});



app.listen(process.env.PORT, () => {
    console.log(`Server is working on port: ${process.env.PORT}`);
});
