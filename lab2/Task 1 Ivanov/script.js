        //ntsc method average
        let avg1 = 0;
        //ntsc hdtv average
        let avg2 = 0;
        //avg1 and avg2 difference
        let avg3 = 0;
        let hasImage = false;
        //arrays for histograms
        //массив с данными о количестве пикселей в полутоновом изображении по ntsc
        let hist1_data = [];
        for (i = 0; i < 256; i++) {
            hist1_data.push(0);
        }
        //массив с данными о количестве пикселей в полутоновом изображении по hdtv
        let hist2_data = [];
        for (i = 0; i < 256; i++) {
            hist2_data.push(0);
        }
        //массив, в котором будут содержаться градации серого от 0 до 255, для вывода на ось х в гистограмме
        let reference_hist = []
        for (i = 0; i < 256; i++) {
            reference_hist.push(i);
        }
        //histogram config
        const cfg = {
            type: 'bar',
            data: {
                labels: reference_hist,
                datasets: [{
                    label: 'ntsc and pal',
                    data: hist1_data,
                    borderWidth: 1,
                    borderColor: 'blue',
                    backgroundColor: 'blue'
                }, {
                    label: 'hdtv',
                    data: hist2_data,
                    borderWidth: 1,
                    borderColor: 'orange',
                    backgroundColor: 'orange'
                }]
            },
            options: {
                responsive: true,

                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        };

        //переменные для обращения к двум канвасам: один с картинками, второй с гистограммой
        const canvas = document.getElementById("view");
        const ctx = canvas.getContext("2d");
        const chart1 = document.getElementById("hist");
        const chart_ctx = chart1.getContext("2d");
        const pic_width = ((window.innerWidth - 10) / 4) - 9;
        let pic_height;
        canvas.width = window.innerWidth - 20;
        canvas.height = 450;

        const input = document.querySelector('#inp')
        const img = document.querySelector('#img')

        //"вытаскивание" изображения из выбранного файла в теге input
        input.addEventListener('change', () => {
            const url = window.URL.createObjectURL(input.files[0])
            img.src = url;
        })

        //гистограма в канвасе с id = chart1 с конфигом cfg
        var myChart;
        // то что происходит при загрузке картинки
        img.onload = () => {
            pic_height = pic_width / (img.width / img.height);
            canvas.height = pic_height;

            var chart_ctx = document.getElementById("hist").getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //вывод изображение в канвас с учетом соотношения сторон
            ctx.drawImage(img, 0, 10, pic_width, pic_height)
            ntsc();
            hdtv();
            diff();
            if (!hasImage) {
                myChart = new Chart(chart1, cfg);
                hasImage = true;
            } else {
                myChart.update();
            }
            //подписи к соответствующим методам
            ctx.font = "48px serif";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.strokeText("sRGB", 0, pic_height);
            ctx.strokeText("NTSC and PAL", pic_width + 12, pic_height - 2, pic_width - 4);
            ctx.strokeText("HDTV", pic_width * 2 + 22, pic_height - 2, pic_width);
            ctx.strokeText("Difference", pic_width * 3 + 32, pic_height - 2, pic_width);
            ctx.fillText("sRGB", 0, pic_height, pic_width);
            ctx.fillText("NTSC and PAL", pic_width + 12, pic_height - 2, pic_width - 4);
            ctx.fillText("HDTV", pic_width * 2 + 22, pic_height - 2, pic_width);
            ctx.fillText("Difference", pic_width * 3 + 33, pic_height - 2, pic_width);
            console.log(hist1_data[0]);
            //обновление гистограммы для нового изображения

            console.log(hist1_data[0]);
        }

        //копирование данных пикселей с канваса , их преобразование по методу ntsc и переписывание данных в канвас
        function ntsc() {
            for (i = 0; i < hist1_data.length; i++) {
                hist1_data[i] = 0;
            }
            const imgData = ctx.getImageData(0, 10, pic_width, pic_width / (img.width / img.height));
            var data = imgData.data;
            for (i = 0; i < data.length; i += 4) {
                avg1 = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
                data[i] = avg1;
                data[i + 1] = avg1;
                data[i + 2] = avg1;
                hist1_data[Math.round(avg1)] += 1;
            }

            ctx.putImageData(imgData, pic_width + 10, 10);
            // console.log(hist1_data[0]);

        }
        //копирование данных пикселей с канваса, их преобразование по методу hdtv и переписывание данных в канвас
        function hdtv() {
            for (i = 0; i < hist2_data.length; i++) {
                hist2_data[i] = 0;
            }
            const imgData = ctx.getImageData(0, 10, pic_width, pic_width / (img.width / img.height));
            var data = imgData.data;
            for (i = 0; i < data.length; i += 4) {
                avg2 = data[i] * 0.21 + data[i + 1] * 0.72 + data[i + 2] * 0.07;
                data[i] = avg2;
                data[i + 1] = avg2;
                data[i + 2] = avg2;
                hist2_data[Math.round(avg2)] += 1;
            }
            ctx.putImageData(imgData, pic_width * 2 + 20, 10);

        }
        //копирование данных пикселей с канваса, подсчет разницы между методами hdtv и ntsc, и переписывание данных в канвас
        function diff() {
            const imgData = ctx.getImageData(0, 10, pic_width, pic_width / (img.width / img.height));
            var data = imgData.data;
            for (i = 0; i < data.length; i += 4) {
                avg3 = Math.abs(avg2 - avg1);
                data[i] = avg3;
                data[i + 1] = avg3;
                data[i + 2] = avg3;

            }
            ctx.putImageData(imgData, pic_width * 3 + 30, 10);
        }