(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) inputs[i].addEventListener("input", (function() {
        if (this.value.length > 6) this.value = this.value.slice(0, 6);
    }));
    const initialDepositInput = document.getElementById("initial-deposit");
    const monthlyPaymentInput = document.getElementById("monthly-payment");
    const profitOutput = document.getElementById("profit");
    const monthsOutput = document.getElementById("months_amount");
    const graph = document.getElementById("graph");
    const pointer = document.querySelector(".earncalculator__pointer");
    const minPosition = 1;
    const maxPosition = 559;
    const step = 15.9434;
    let initialDeposit = 2e3;
    let monthlyPayment = 0;
    updateProfit();
    initialDepositInput.addEventListener("change", (function(event) {
        initialDeposit = parseFloat(event.target.value) || 0;
        if (initialDeposit < 2e3) initialDeposit = 2e3; else if (initialDeposit > 1e5) initialDeposit = 1e5;
        initialDepositInput.value = initialDeposit;
        updateProfit();
    }));
    monthlyPaymentInput.addEventListener("change", (function(event) {
        monthlyPayment = parseFloat(event.target.value) || 0;
        updateProfit();
    }));
    function calculateProfit(months) {
        let profitRate = 0;
        if (months <= 12) profitRate = .15; else if (months > 12 && months <= 24) profitRate = .18; else if (months > 24) profitRate = .25;
        return profitRate;
    }
    function updateProfit() {
        let months = getMonthByPointer();
        let total = initialDeposit;
        for (let i = 0; i < months; i++) {
            total += monthlyPayment;
            let profitRate = calculateProfit(i + 1);
            let profit = total * profitRate;
            total += profit / 12;
        }
        monthsOutput.innerText = months;
        profitOutput.innerText = "$" + total.toFixed(2);
    }
    var pt = graph.createSVGPoint();
    function cursorPoint(evt) {
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        return pt.matrixTransform(graph.getScreenCTM().inverse());
    }
    graph.addEventListener("pointermove", (e => {
        let loc = cursorPoint(e);
        const clampedPosition = clamp(loc.x, minPosition, maxPosition);
        const roundedPosition = roundToStep(clampedPosition, step);
        const pointerPositionX = getPositionX(pointer);
        if (pointerPositionX !== roundedPosition) {
            setPositionX(pointer, roundedPosition);
            updateProfit();
        }
    }));
    function getMonthByPointer() {
        let x = getPositionX(pointer);
        return Math.round(x / step + 1);
    }
    function getPositionX(element) {
        const posX = element.getAttribute("x");
        return posX ? parseFloat(posX) : 0;
    }
    function setPositionX(element, value) {
        element.setAttribute("x", value);
    }
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function roundToStep(value, step) {
        return Math.round(value / step) * step;
    }
    const dropdown = document.querySelectorAll(".calc__dropdown");
    dropdown.forEach((dropdown => {
        const select = dropdown.querySelector(".select");
        const caret = dropdown.querySelector(".caret");
        const menu = dropdown.querySelector(".menu");
        const options = dropdown.querySelectorAll(".menu li");
        const selected = dropdown.querySelector(".selected");
        select.addEventListener("click", (() => {
            select.classList.toggle("select-clicked");
            caret.classList.toggle("caret-rotate");
            menu.classList.toggle("menu-open");
        }));
        options.forEach((option => {
            option.addEventListener("click", (() => {
                selected.innerText = option.innerText;
                select.classList.remove("select-clicked");
                caret.classList.remove("caret-rotate");
                menu.classList.remove("menu-open");
                options.forEach((option => {
                    option.classList.remove("active");
                }));
                option.classList.add("active");
            }));
        }));
    }));
    window["FLS"] = true;
    isWebp();
})();