window.addEventListener('DOMContentLoaded', (event) => {
    //console.log(event);
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach( item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(numItem = 0) {
        tabsContent[numItem].classList.add('show', 'fade');
        tabsContent[numItem].classList.remove('hide');
        tabs[numItem].classList.add('tabheader__item_active');


    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        // console.log('-click on tab item');
        // console.dir(target);
        // console.log('click on tab item-');
        if (target && target.classList.contains('tabheader__item')) {
            
            tabs.forEach((item, numItem) => {
                //console.dir(item);
                if (target == item) {
                    
                    
                    hideTabContent();
                    showTabContent(numItem);

                };
            });
        };
    });

    const deadline = '2021-01-19';

    function getTimeRemaining(endtime) {
        const deltaTime = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(deltaTime / (1000 * 60 * 60 * 24)),
              hours = Math.floor((deltaTime / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((deltaTime / (1000 * 60)) % (60)),
              seconds = Math.floor((deltaTime / 1000 ) % (60));
        //console.log(`d:${days},h:${hours},m:${minutes},s:${seconds}`);
        return {
            "total": deltaTime,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    function getZero(number) {
        if (number >= 0 && number < 10) {
            return `0${number}`;
        } else if (number >=10) {
            return number;
          }
        else {
            return '00';
        };
    }

    function setClock(selectorElement, endtime) {
        
        const timer = document.querySelector(selectorElement),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeinterval = setInterval(updateClock, 1000);
        
        //console.dir(timer);

        function updateClock() {
            const deltaDate = getTimeRemaining(endtime);
            //console.dir(deltaDate);
            days.innerHTML = getZero(deltaDate.days);
            
            hours.innerHTML = getZero(deltaDate.hours);
            minutes.innerHTML = getZero(deltaDate.minutes);
            seconds.innerText = getZero(deltaDate.seconds);
            

            if (deltaDate.total <= 0) {

                clearInterval(timeinterval);
            }
        }

        updateClock();

    }

    //getTimeRemaining(deadline);

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
          //modalCloseBtn = document.querySelector('[data-close]');

    
    
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    };

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    modalTrigger.forEach( btn => {
        btn.addEventListener('click', openModal);
    });

    //modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        //console.log(event.target);
        if (event.target == modal || event.target.getAttribute('date-close') == '') { 
            closeModal();
        };
    });

    document.addEventListener('keydown', (event) => {
        //console.log(event.code);
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        };
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        // console.log(window.pageYOffset);
        // console.log(document.documentElement.clientHeight);
        // console.log(document.documentElement.scrollHeight);
        if (window.pageYOffset + document.documentElement.clientHeight >= 
            document.documentElement.scrollHeight) {
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            };

    };

    window.addEventListener('scroll', showModalByScroll);

    //class for cards

    class MenuCard {
        constructor(srcImg, altText, title, description, price, parentSelector, transfer = 1,  ...classes){
            this.srcImg = srcImg;
            this.altText = altText;
            this.title = title;
            this.description = description;
            this.price = price;
            this.classes = classes;
            this.transfer = transfer;
            this.parent = document.querySelector(parentSelector);
            //console.log(this.parent);
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;
            
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            this.classes.forEach(className => element.classList.add(className));
            element.innerHTML = `
            
                <img src="${this.srcImg}" alt=${this.altText}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const result = await fetch(url);
        if (!result.ok) {
            throw new Error(`Could not fetch ${url}, status ${result.status}`);
        }
        return result.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         // data.forEach(menuObject => {
    //         //     new MenuCard(menuObject.img, menuObject.altimg, menuObject.title, menuObject.descr, menuObject.price).render();
    //         // });
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container', 80, 'menu__item', 'big').render();
    //         });
    //     });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    function createCard(data) {
        data.forEach(({img, altimg, title, descr, price})=>{
            const element =document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML =`
                <img src="${img}" alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> руб/день</div>
                </div>
            `;
            document.querySelector('.menu .container').append(element);
        });

    }

    axios.get('http://localhost:3000/menu')
        .then(data => createCard(data.data));

    // new MenuCard(
    //     "img/tabs/vegy.jpg",
    //     "vegy",
    //     'Меню "Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     229,
    //     '.menu .container',
    //     2,
    //     'menu__item',
    //     'big'
    // ).render();

    // Forms

    const forms = document.querySelectorAll('form');
    
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы свяжемся с вами!',
        failure: 'Нет связи'

    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const result = await fetch(url, {
            method:"POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return result.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            //form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            
            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            //request.setRequestHeader('Content-type', 'multipart/form-data');
            //request.setRequestHeader('Content-type', 'application/json');
            
            const formData = new FormData(form);
            // const object = {};
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            //const json = JSON.stringify(object);


            //request.send(formData);
            //request.send(json);

            // 
            postData('http://localhost:3000/requests', json)
            //.then(data => data.text())
            .then(data => {
                console.log(data);
                statusMessage.textContent = message.success;
                showThanksModal(message.success);
                form.reset();
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            })

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         //statusMessage.textContent = message.success;
            //         showThanksModal(message.success);
            //         form.reset();
                    
            //         statusMessage.remove();
                    
            //     } else {
            //         //statusMessage.textContent = message.failure;
            //         showThanksModal(message.failure);
            //     };
            // });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" date-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }


    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));
        
    // Slider

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),  
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('.offer__slider-counter #current'),
          total = document.querySelector('.offer__slider-counter #total'),
          slideWrapper = document.querySelector('.offer__slider-wrapper'),
          slideInner = slideWrapper.querySelector('.offer__slider-inner'),
          widthSlider = window.getComputedStyle(slideWrapper).width;
                  

    let slideIndex = 1;
    let offsetSlide = 0;

    total.innerHTML = slideNumber(slides.length);
    current.innerHTML = slideNumber(slideIndex);

    slideInner.style.width = 100 * slides.length + '%';
    slideInner.style.display = 'flex';
    slideInner.style.transition = '0.5s all';
    slideWrapper.style.overflow = 'hidden';
    slides.forEach(slide => {
        slide.style.width = widthSlider
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
          dots = [];  
    indicators.classList.add('carousel-indicators');
    // indicators.style.cssText = `
    //     position: absolute;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     z-index: 15;
    //     display: flex;
    //     justify-content: center;
    //     margin-right: 15%;
    //     margin-left: 15%;
    //     list-style: none;
    // `;
    slider.append(indicators);

    for (let numSlides = 0; numSlides < slides.length; numSlides++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', numSlides + 1);
        dot.classList.add('dot');
        if (numSlides == 0) {
            dot.style.opacity = 1;
        };
        // dot.style.cssText = `
        //     box-sizing: content-box;
        //     flex: 0 1 auto;
        //     width: 30px;
        //     height: 6px;
        //     margin-right: 3px;
        //     margin-left: 3px;
        //     cursor: pointer;
        //     background-color: #fff;
        //     background-clip: padding-box;
        //     border-top: 10px solid transparent;
        //     border-bottom: 10px solid transparent;
        //     opacity: .5;
        //     transition: opacity .6s ease;
        // `;
        indicators.append(dot);
        dots.push(dot);


    };

    function changeDots(slideIndex) {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    };

    function slideNumber (slideNum) {
        if (slideNum < 10) {
            return `0${slideNum}`;
        } else {
            return slideNumber;
        };

    };
    
    function changeSlide(slideIndex) {
        offsetSlide = widthSlider.slice(0, widthSlider.length-2) * (slideIndex-1);
        slideInner.style.transform = `translateX(-${offsetSlide}px)`;
        current.innerHTML = slideNumber(slideIndex);
        changeDots(slideIndex);
    };

    dots.forEach( dot => {
        dot.addEventListener('click', event => {
            slideIndex = event.target.getAttribute('data-slide-to');
            changeSlide(slideIndex);
        });    
    });

    next.addEventListener('click', () => {
        if (offsetSlide == +widthSlider.slice(0, widthSlider.length-2) * (slides.length - 1)) {
            //offsetSlide = 0;
            slideIndex = 1;
        } else {
            //offsetSlide += +widthSlider.slice(0, widthSlider.length-2);
            slideIndex ++;
        };
        //slideInner.style.transform = `translateX(-${offsetSlide}px)`;
        changeSlide(slideIndex);
    });

    prev.addEventListener('click', () => {

        if (offsetSlide == 0) {
            //offsetSlide = +widthSlider.slice(0, widthSlider.length-2) * (slides.length - 1);
            slideIndex = slides.length;
            
        } else {
            //offsetSlide -= +widthSlider.slice(0, widthSlider.length-2);
            slideIndex --;
        };
        //slideInner.style.transform = `translateX(-${offsetSlide}px)`;
        changeSlide(slideIndex);
        
    });

    
    
    

    

    // showSlides(slideIndex);

    

    // function showSlides(curentSlide) {
    //     if (curentSlide > slides.length) {
    //         slideIndex = 1;
    //     }
    //     if (slideIndex < 1) {
    //         slideIndex = slides.length;
    //     }
    //     current.innerHTML = slideNumber(slideIndex);
    //     //slides.forEach(item => item.style.display = 'none');

    //     //slides[slideIndex-1].style.display = 'block';
    // }
    
    // function plusSlides(changeIndex) {
    //     showSlides(slideIndex += changeIndex);
        
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // })

});