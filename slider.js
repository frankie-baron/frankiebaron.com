const SLIDE_INTERVAL = 4000;
const DISAPPEAR_TIME = 300;
const BREAK_TIME = 400;
const IDLE_TIME = 2000;

let currentIndex = 0;
let isHovered = false;
let hoverTimeout;

const sliderIcons = document.querySelectorAll('.slider-icon');
const sliderText = document.querySelector('.slider-text');

const iconData = [
    {name: 'Scoop', text: 'Scoop: A great app for news.', url: 'https://apps.apple.com/us/app/scoop-mae/id971907235'},
    {name: 'DuzyBen', text: 'Duży Ben: A handy timer.', url: 'https://apps.apple.com/pl/app/duży-ben/id1449706466'},
    {name: 'EasyInvoice', text: 'EasyInvoice: Simplifying billing.', url: 'https://apps.apple.com/us/app/easy-invoice/id579897691'},
    {name: 'Wage', text: 'Wage: Manage your salary.', url: 'https://apps.apple.com/us/app/wage-get-the-job-done/id1330725330'},
    {name: 'Fairtiq', text: 'Fairtiq: Swiss public transport made easy.', url: 'https://apps.apple.com/ch/app/fairtiq/id1094360403?l=en'},
    {name: 'AdNote', text: 'AdNote: Organize your notes.', url: 'https://apps.apple.com/pl/app/adnote/id1544405333?l=en'}
];

let autoSlideInterval;
let textAnimationTimeouts = [];

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        if (!isHovered) {
            hideText(() => {
                clearHighlightedIcon();
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % iconData.length;
                    updateIcons();
                }, BREAK_TIME);
            });
        }
    }, SLIDE_INTERVAL);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function animateText(text) {
    let charIndex = 0;
    textAnimationTimeouts.forEach(clearTimeout);
    textAnimationTimeouts = [];
    const timePerChar = (SLIDE_INTERVAL - DISAPPEAR_TIME - BREAK_TIME - IDLE_TIME) / text.length;
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

function clearHighlightedIcon() {
    sliderIcons.forEach((div, index) => {
        const img = div.querySelector('img');
        img.src = 'images/slider/icon' + iconData[index].name + 'Mono.png';
    });
}

function updateIcons() {
    sliderIcons.forEach((div, index) => {
        const img = div.querySelector('img');
        if (index === currentIndex) {
            img.src = 'images/slider/icon' + iconData[index].name + 'Color.png';
        } else {
            img.src = 'images/slider/icon' + iconData[index].name + 'Mono.png';
        }
    });
    animateText(iconData[currentIndex].text);
}

function setIconUrls() {
    sliderIcons.forEach((div, index) => {
        const a = div.querySelector('a');
        a.href = iconData[index].url
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
    });
}

function highlightIconOnHover(event) {
    isHovered = true;
    clearTimeout(hoverTimeout);
    const iconName = event.currentTarget.getAttribute('data-icon-name');
    const hoveredIndex = iconData.findIndex(data => data.name === iconName);
    if (hoveredIndex !== currentIndex) {
        stopAutoSlide();
        currentIndex = hoveredIndex;
        updateIcons();
    }
}

function restartAutoSlideOnHoverEnd() {
    isHovered = false;
    hoverTimeout = setTimeout(() => {
        hideText(() => {
            clearHighlightedIcon();
            setTimeout(startAutoSlide, BREAK_TIME + IDLE_TIME);
        });
    }, IDLE_TIME);
}

sliderIcons.forEach(div => {
    div.addEventListener('mouseover', highlightIconOnHover);
    div.addEventListener('mouseout', restartAutoSlideOnHoverEnd);
});

updateIcons();
setIconUrls();
startAutoSlide();
