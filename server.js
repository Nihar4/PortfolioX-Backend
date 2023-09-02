import app from "./app.js";
import { connectDB } from "./config/database.js";
import nodeCron from "node-cron";
import axios from "axios";
connectDB();

let part1, part2, part3, part4;
let part1data = [], part2data = [], part3data = [], part4data = [];
const getsymbols = async () => {
    const response = await axios.get('https://portfolio-x-two.vercel.app/api/v1/splitallstocks');
    part1 = response.data.part1;
    part2 = response.data.part2;
    // part3 = response.data.part3;
    // part4 = response.data.part4;
    // console.log(part1, part2, part3, part4);
    // console.log(response.data);

    async function fetchDataAndMerge() {
        try {
            // console.log(part1);
            part1data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part1 });
            part1data = part1data.data.filteredLogoData;
        } catch (error) {
            // console.log(error);
        }

        // Set a 1-hour timeout for part2
        setTimeout(async () => {
            try {
                // console.log(part2);
                part2data = await axios.post('https://portfolio-x-two.vercel.app/api/v1/createallstocks', { "part": part2 });
                part2data = part2data.data.filteredLogoData;

                try {
                    console.log("hello");
                    await axios.post('https://portfolio-x-two.vercel.app/api/v1/mergeAllStocks', { "part1data": part1data, "part2data": part2data });
                } catch (error) {
                    // console.log(error);
                }
            } catch (error) {
                // console.log(error);
            }
        }, 5 * 60 * 1000); // 1 hour in milliseconds
    }

    // Call the fetchDataAndMerge function initially
    fetchDataAndMerge();

    // Set a 2-hour interval to repeat the entire process
    setInterval(fetchDataAndMerge, 15 * 60 * 1000); // 2 hours in milliseconds



}
getsymbols();


// nodeCron.schedule("0 30 1,3,5,7,9,11,13,15,17,19,21,23 * * *", async () => {
//     try {
//         console.log(part1);
//         part1data = await axios.post('http://localhost:4000/api/v1/createallstocks', { "part": part1 });
//         part1data = part1data.data.filteredLogoData;
//     } catch (error) {
//         console.log(error);
//     }
// });
// nodeCron.schedule("0 0 0,2,4,6,8,10,12,14,16,18,20,22 * * *", async () => {
//     try {
//         console.log(part2)
//         part2data = await axios.post('http://localhost:4000/api/v1/createallstocks', { "part": part2 });
//         part2data = part2data.data.filteredLogoData;
//     } catch (error) {
//         console.log(error);
//     }
//     try {
//         console.log("hello")
//         await axios.post('http://localhost:4000/api/v1/mergeAllStocks', { "part1data": part1data, "part2data": part2data });

//     } catch (error) {
//         console.log(error);
//     }

// });
// nodeCron.schedule("0 0 2,6,10,14,18,22 * * *", async () => {
//     try {
//         console.log("hello3")
//         part3data = await axios.post('http://localhost:4000/api/v1/createallstocks', { "part": part3 });
//         part3data = part3data.data.filteredLogoData;
//     } catch (error) {
//         console.log(error);
//     }
// });
// nodeCron.schedule("0 0 3,7,11,15,19,23 * * *", async () => {
//     try {
//         console.log("hello4")
//         part4data = await axios.post('http://localhost:4000/api/v1/createallstocks', { "part": part4 });
//         part4data = part4data.data.filteredLogoData;
//     } catch (error) {
//         console.log(error);
//     }
// });

// nodeCron.schedule("0 55 0,2,4,6,8,10,12,14,16,18,20,22 * * *", async () => {
//     try {
//         console.log("hello")
//         await axios.post('http://localhost:4000/api/v1/mergeAllStocks', { "part1data": part1data, "part2data": part2data });

//     } catch (error) {
//         console.log(error);
//     }
// });



app.listen(process.env.PORT, () => {
    console.log(`Server is working on port: ${process.env.PORT}`);
});
