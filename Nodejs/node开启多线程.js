methods: {
            bigDownload: async function (filetype) {
                console.log("downloading.",filetype, "..............")

                let div = document.createElement("div");
                div.id = `status-download-${moment().valueOf()}`;
                div.style.height = "20px";
                div.style.color = "black";
                div.style.background = "linear-gradient(to top right, pink 5%,purple 100%)";
                div.style.color = "white";
                div.innerHTML =  "";
                document.getElementById("statusbar").appendChild(div);
                let tasks = vContainer.files[filetype]
                fs.mkdirSync(`${downloadFolder}/ALL-${filetype}/`, {recursive: true})
                async function fetch_worker(j , num_threads) {
                    for (let i = 0; i < tasks.length; i++) {
                        if (i % num_threads !== j) continue;
                        let cmd = `adb -s ${thisDevice}  pull -p ${tasks[i]} ${downloadFolder}/ALL-${filetype}/`
                        div.innerHTML = `== ${tasks.length} / ${i + 1}  == : ${tasks[i]} -> ${downloadFolder}/ALL-${filetype}/`;
                        await execPromise(cmd).then().catch((e) => {
                            console.log(e)
                        });
                    }
                    if ( j + 1 === num_threads) {
                        setTimeout(
                            () => {div.remove()}
                            , 3000
                        )
                    }
                }
                let num_threads = 8
                for (let j = 0; j < num_threads; j++) {
                    fetch_worker(j,num_threads)
                }
            }
        }

const {exec} = require('child_process');
    function execPromise(command) {
        return new Promise(function (resolve, reject) {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout.trim());
            });
        });
    }
