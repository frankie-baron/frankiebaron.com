const SLIDE_INTERVAL = 4000;
const APPEAR_TIME = 400;
const DISAPPEAR_TIME = 300;
const BREAK_TIME = 400;
const IDLE_TIME = 2000;

let currentIndex = -1;
let isHovered = false;
let hoverTimeout;

const sliderIcons = document.querySelectorAll('.slider-icon');
const sliderText = document.querySelector('.slider-text');

const iconData = [
    {name: 'Scoop', text: 'Scoop: A great tool to elevate your team\'s performance.', url: 'https://apps.apple.com/us/app/scoop-mae/id971907235'},
    {name: 'DuzyBen', text: 'Duży Ben: Your favorite wines and spirits at the best prices.', url: 'https://apps.apple.com/pl/app/duży-ben/id1449706466'},
    {name: 'EasyInvoice', text: 'Easy Invoice: All-in-one invoicing solution for small businesses.', url: 'https://apps.apple.com/us/app/easy-invoice/id579897691'},
    {name: 'Wage', text: 'Wage: Helping people get their jobs done faster. ', url: 'https://apps.apple.com/us/app/wage-get-the-job-done/id1330725330'},
    {name: 'Fairtiq', text: 'Fairtiq: Swiss public transport made easy. Over 118 million times.', url: 'https://apps.apple.com/ch/app/fairtiq/id1094360403?l=en'},
    {name: 'AdNote', text: 'AdNote: Organizing your team\'s workflow.', url: 'https://apps.apple.com/pl/app/adnote/id1544405333?l=en'}
];


let autoSlideInterval;
let slideClosureTimeout;
let textAnimationTimeouts = [];

function setIconUrls() {
    sliderIcons.forEach((div, index) => {
        const a = div.querySelector('a');
        a.href = iconData[index].url
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
    });
}

function startAutoSlide() {
    stopAutoSlide();
    performSlide();
    autoSlideInterval = setInterval(() => {
        if (!isHovered) {
            performSlide()
        } else {
            stopAutoSlide()
        }
    }, SLIDE_INTERVAL);
}

function performSlide() {
        currentIndex = (currentIndex + 1) % iconData.length;
        updateIconHighlight();
        showText();
        setSlideClosureTimeout(SLIDE_INTERVAL - DISAPPEAR_TIME - BREAK_TIME)
}

function setSlideClosureTimeout(timeout) {
    slideClosureTimeout = setTimeout(() => {
        hideText(() => {
            clearIconHighlight();
        }); 
    }, timeout);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    clearTimeout(slideClosureTimeout);
}

function showText() {
    let text = iconData[currentIndex].text
    let charIndex = 0;
    textAnimationTimeouts.forEach(clearTimeout);
    textAnimationTimeouts = [];
    const timePerChar = APPEAR_TIME / text.length;
    for (let i = 0; i <= text.length; i++) {
        textAnimationTimeouts.push(setTimeout(() => {
            sliderText.textContent = text.substr(0, charIndex);
            charIndex++;
        }, timePerChar * i));
    }
}

function hideText(callback) {
    const currentText = sliderText.textContent;
    const timePerChar = DISAPPEAR_TIME / currentText.length;
    let charIndex = currentText.length;
    textAnimationTimeouts.forEach(clearTimeout);
    textAnimationTimeouts = [];
    for (let i = 0; i < currentText.length; i++) {
        textAnimationTimeouts.push(setTimeout(() => {
            sliderText.textContent = currentText.substr(0, charIndex);
            charIndex--;
            if (i === currentText.length - 1) {
                sliderText.textContent = '';
                callback();
            }
        }, timePerChar * i));
    }
}

function clearIconHighlight() {
    sliderIcons.forEach((div, index) => {
        const img = div.querySelector('img');
        img.src = 'images/slider/icon' + iconData[index].name + 'Mono.png';
    });
}

function updateIconHighlight() {
    sliderIcons.forEach((div, index) => {
        const img = div.querySelector('img');
        if (index === currentIndex) {
            img.src = 'images/slider/icon' + iconData[index].name + 'Color.png';
        } else {
            img.src = 'images/slider/icon' + iconData[index].name + 'Mono.png';
        }
    });
}

function highlightIconOnHover(event) {
    isHovered = true;
    clearTimeout(hoverTimeout);
    stopAutoSlide();
    const iconName = event.currentTarget.getAttribute('data-icon-name');
    const hoveredIndex = iconData.findIndex(data => data.name === iconName);

    if (hoveredIndex !== currentIndex) {
        currentIndex = hoveredIndex;
        updateIconHighlight();
        showText();
    }
}

function restartAutoSlideOnHoverEnd() {
    isHovered = false;
    setSlideClosureTimeout(IDLE_TIME)
    hoverTimeout = setTimeout(() => {
        startAutoSlide()
    }, IDLE_TIME + DISAPPEAR_TIME + BREAK_TIME)
}

sliderIcons.forEach(div => {
    div.addEventListener('mouseover', highlightIconOnHover);
    div.addEventListener('mouseout', restartAutoSlideOnHoverEnd);
});

setIconUrls();
startAutoSlide();
