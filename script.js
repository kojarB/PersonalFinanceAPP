document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            title: 'Loan Savings Calculator',
            loanAmountLabel: 'Total Loan Amount',
            interestRateLabel: 'Annual Interest Rate (%)',
            loanTermLabel: 'Loan Term (years)',
            extraPaymentLabel: 'Extra Monthly Payment',
            calculateBtn: 'Calculate Savings',
            summaryTitle: 'Your Savings Summary',
            standardLoanTitle: 'Standard Loan',
            monthlyPaymentLabel: 'Monthly Payment',
            totalInterestLabel: 'Total Interest',
            totalCostLabel: 'Total Cost',
            extraPaymentsTitle: 'With Extra Payments',
            timeSavedLabel: 'Time Saved',
            yourSavingsTitle: 'Your Savings',
            interestSavedLabel: 'Interest Saved',
            afterTaxSavingsLabel: 'After Tax Deduction (22%)',
            payoffTimeLabel: 'Payoff Time',
            monthsSooner: 'months sooner',
            currency: 'NOK',
            locale: 'en-US', 
            currencySymbol: 'NOK',
            loanAmountPlaceholder: 'e.g., 2 500 000',
            interestRatePlaceholder: 'e.g., 5.4',
            loanTermPlaceholder: 'e.g., 30',
            extraPaymentPlaceholder: 'e.g., 200',
            yearSingular: 'year',
            yearPlural: 'years',
            monthSingular: 'month',
            monthPlural: 'months',
            and: 'and'
        },
        no: {
            title: 'Lånesparekalkulator',
            loanAmountLabel: 'Totalt Lånebeløp',
            interestRateLabel: 'Årlig Rente (%)',
            loanTermLabel: 'Lånetid (år)',
            extraPaymentLabel: 'Ekstra Månedlig Betaling',
            calculateBtn: 'Beregn Besparelser',
            summaryTitle: 'Dine Besparelser',
            standardLoanTitle: 'Standard Lån',
            monthlyPaymentLabel: 'Månedlig Betaling',
            totalInterestLabel: 'Total Rente',
            totalCostLabel: 'Total Kostnad',
            extraPaymentsTitle: 'Med Ekstra Betalinger',
            timeSavedLabel: 'Spart Tid',
            yourSavingsTitle: 'Dine Besparelser',
            interestSavedLabel: 'Spart Rente',
            afterTaxSavingsLabel: 'Etter Skattefradrag (22%)',
            payoffTimeLabel: 'Nedbetalingstid',
            monthsSooner: 'måneder tidligere',
            currency: 'NOK',
            locale: 'nb-NO',
            currencySymbol: 'NOK',
            loanAmountPlaceholder: 'f.eks. 2 500 000',
            interestRatePlaceholder: 'f.eks. 5,4',
            loanTermPlaceholder: 'f.eks. 30',
            extraPaymentPlaceholder: 'f.eks. 200',
            yearSingular: 'år',
            yearPlural: 'år',
            monthSingular: 'måned',
            monthPlural: 'måneder',
            and: 'og'
        }
    };

    let currentLanguage = 'en';
    let loanChart = null;

    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    const extraPaymentInput = document.getElementById('extraPayment');
    const calculateBtn = document.getElementById('calculateBtn');
    const results = document.getElementById('results');

    const formatNumber = (numStr) => {
        if (!numStr) return '';
        const num = parseFloat(numStr.replace(/\s/g, ''));
        if (isNaN(num)) return '';
        return num.toLocaleString(translations[currentLanguage].locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/,/g, ' ');
    };

    const parseNumber = (formattedStr) => {
        if (!formattedStr) return null;
        return parseFloat(formattedStr.replace(/\s/g, '').replace(',', '.'));
    };

    const parseInterestRate = (formattedStr) => {
        if (!formattedStr) return null;
        return parseFloat(formattedStr.replace(',', '.'));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(translations[currentLanguage].locale, {
            style: 'currency',
            currency: translations[currentLanguage].currencySymbol,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatTimeSaved = (totalMonths) => {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        let result = '';
        if (years > 0) {
            result += `${years} ${years === 1 ? translations[currentLanguage].yearSingular : translations[currentLanguage].yearPlural}`;
        }
        if (months > 0) {
            if (years > 0) result += ` ${translations[currentLanguage].and} `;
            result += `${months} ${months === 1 ? translations[currentLanguage].monthSingular : translations[currentLanguage].monthPlural}`;
        }
        return result || '0 ' + translations[currentLanguage].monthPlural;
    };

    const setLanguage = (lang) => {
        currentLanguage = lang;
        document.documentElement.lang = lang;
        document.getElementById('title').textContent = translations[lang].title;
        document.getElementById('loanAmountLabel').textContent = translations[lang].loanAmountLabel;
        document.getElementById('interestRateLabel').textContent = translations[lang].interestRateLabel;
        document.getElementById('loanTermLabel').textContent = translations[lang].loanTermLabel;
        document.getElementById('extraPaymentLabel').textContent = translations[lang].extraPaymentLabel;
        calculateBtn.textContent = translations[lang].calculateBtn;
        document.getElementById('summaryTitle').textContent = translations[lang].summaryTitle;
        document.getElementById('standardLoanTitle').textContent = translations[lang].standardLoanTitle;
        document.getElementById('monthlyPaymentLabel').textContent = translations[lang].monthlyPaymentLabel;
        document.getElementById('totalInterestLabel').textContent = translations[lang].totalInterestLabel;
        document.getElementById('totalCostLabel').textContent = translations[lang].totalCostLabel;
        document.getElementById('extraPaymentsTitle').textContent = translations[lang].extraPaymentsTitle;
        document.getElementById('timeSavedLabel').textContent = translations[lang].timeSavedLabel;
        document.getElementById('yourSavingsTitle').textContent = translations[lang].yourSavingsTitle;
        document.getElementById('interestSavedLabel').textContent = translations[lang].interestSavedLabel;
        document.getElementById('afterTaxSavingsLabel').textContent = translations[lang].afterTaxSavingsLabel;

        loanAmountInput.placeholder = translations[lang].loanAmountPlaceholder;
        interestRateInput.placeholder = translations[lang].interestRatePlaceholder;
        loanTermInput.placeholder = translations[lang].loanTermPlaceholder;
        extraPaymentInput.placeholder = translations[lang].extraPaymentPlaceholder;
        
        if (results.style.display === 'block') {
            calculateBtn.click(); 
        }
        if (loanChart) {
            loanChart.options.scales.y.ticks.callback = value => formatCurrency(value);
            loanChart.data.datasets[0].label = translations[lang].standardLoanTitle; 
            loanChart.data.datasets[1].label = translations[lang].extraPaymentsTitle;
            loanChart.update();
        }
    };

    document.getElementById('lang-toggle').addEventListener('change', (event) => {
        setLanguage(event.target.checked ? 'no' : 'en');
    });

    [loanAmountInput, extraPaymentInput].forEach(input => {
        input.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const originalLength = e.target.value.length;
            const value = e.target.value;
            const sanitizedValue = value.replace(/[^0-9]/g, ''); 
            e.target.value = formatNumber(sanitizedValue);
            const newLength = e.target.value.length;
            e.target.setSelectionRange(cursorPosition + (newLength - originalLength), cursorPosition + (newLength - originalLength));
        });
    });

    interestRateInput.addEventListener('beforeinput', (e) => {
        // This event fires before the input value is changed.
        // It allows us to prevent invalid input from ever being added to the field.
        const input = e.target;
        const value = input.value;
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;
        const data = e.data; // The character(s) being inserted. Can be null for deletions.

        // Allow deletions, arrow keys, etc. (anything that doesn't insert data)
        if (!data) {
            return;
        }

        // Construct what the value of the input *would be* if this change were allowed.
        const nextValue = value.substring(0, selectionStart) + data + value.substring(selectionEnd);

        // Test if the proposed value is valid.
        // A valid value contains only digits and at most one decimal separator (dot or comma).
        // We test for both dot and comma here because the user might type either.
        // The 'input' event will handle normalizing commas to dots.
        const isOnlyNumericAndSeparators = /^[0-9,.]*$/.test(nextValue);
        const dotCount = (nextValue.match(/\./g) || []).length;
        const commaCount = (nextValue.match(/,/g) || []).length;

        // If the proposed value contains invalid characters, or more than one decimal separator in total, prevent the input.
        if (!isOnlyNumericAndSeparators || (dotCount + commaCount) > 1) {
            e.preventDefault();
        }
    });

    interestRateInput.addEventListener('input', (e) => {
        // This event fires *after* the input value has changed.
        // Its only job now is to normalize any comma to a dot.
        // The 'beforeinput' handler has already prevented invalid characters and multiple separators.
        const input = e.target;
        const value = input.value;
        const selectionStart = input.selectionStart;

        // If a comma exists, replace it with a dot.
        if (value.includes(',')) {
            const newValue = value.replace(/,/g, '.');
            input.value = newValue;
            // Since we did a 1-for-1 replacement, the cursor position is stable.
            // We just need to set it back to where it was, as changing .value moves it to the end.
            input.setSelectionRange(selectionStart, selectionStart);
        }
    });

    loanTermInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    const calculateAmortization = (principal, annualRate, termYears, extraMonthlyPayment) => {
        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = termYears * 12;
        let monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) monthlyPayment = principal / totalMonths; 

        let balance = principal;
        let totalInterest = 0;
        const amortization = [];
        let months = 0;

        for (months = 0; months < totalMonths * 2 && balance > 0.01; months++) { 
            const interestPayment = balance * monthlyRate;
            const principalPayment = (monthlyPayment - interestPayment) + extraMonthlyPayment;
            balance -= principalPayment;
            totalInterest += interestPayment;
            amortization.push({ month: months + 1, balance: Math.max(0, balance) });
            if (balance <= 0.01) break;
        }
        return { monthlyPayment, totalInterest, totalMonths: months +1, amortization };
    };

    const updateChart = (standardAmortization, extraAmortization) => {
        const ctx = document.getElementById('loanChart').getContext('2d');
        if (loanChart) {
            loanChart.destroy();
        }

        const standardData = standardAmortization.map(p => ({ x: p.month / 12, y: p.balance }));
        const extraData = extraAmortization.map(p => ({ x: p.month / 12, y: p.balance }));

        const maxYears = Math.max(
            Math.ceil(standardAmortization[standardAmortization.length - 1].month / 12),
            extraAmortization.length > 0 ? Math.ceil(extraAmortization[extraAmortization.length - 1].month / 12) : 0
        );

        loanChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: translations[currentLanguage].standardLoanTitle || 'Standard Loan Balance',
                    data: standardData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: translations[currentLanguage].extraPaymentsTitle || 'Loan Balance with Extra Payments',
                    data: extraData,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Years' }, 
                        ticks: {
                            stepSize: 1,
                            maxTicksLimit: maxYears < 15 ? maxYears + 1 : 15, 
                            callback: function(value) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        }
                    },
                    y: {
                        title: { display: true, text: 'Loan Balance' }, 
                        ticks: { callback: value => formatCurrency(value) }
                    }
                }
            }
        });
    };

    calculateBtn.addEventListener('click', () => {
        const requiredInputs = [loanAmountInput, interestRateInput, loanTermInput];
        let isValid = true;

        requiredInputs.forEach(input => {
            input.classList.remove('input-error');
            if (!input.value) {
                input.classList.add('input-error');
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        const loanAmount = parseNumber(loanAmountInput.value);
        const interestRate = parseInterestRate(interestRateInput.value);
        const loanTerm = parseInt(loanTermInput.value);
        const extraPayment = parseNumber(extraPaymentInput.value) || 0;

        const standardLoan = calculateAmortization(loanAmount, interestRate, loanTerm, 0);
        const extraLoan = calculateAmortization(loanAmount, interestRate, loanTerm, extraPayment);

        document.getElementById('standardPayment').textContent = formatCurrency(standardLoan.monthlyPayment);
        document.getElementById('standardInterest').textContent = formatCurrency(standardLoan.totalInterest);
        document.getElementById('standardTotal').textContent = formatCurrency(loanAmount + standardLoan.totalInterest);

        document.getElementById('extraPaymentDisplay').textContent = formatCurrency(standardLoan.monthlyPayment + extraPayment);
        document.getElementById('extraInterest').textContent = formatCurrency(extraLoan.totalInterest);
        document.getElementById('extraTotal').textContent = formatCurrency(loanAmount + extraLoan.totalInterest);

        const interestSaved = standardLoan.totalInterest - extraLoan.totalInterest;
        const afterTaxSavings = interestSaved * (1 - 0.22);
        const timeSaved = standardLoan.totalMonths - extraLoan.totalMonths;

        document.getElementById('interestSaved').textContent = formatCurrency(interestSaved);
        document.getElementById('afterTaxSavings').textContent = formatCurrency(afterTaxSavings);
        document.getElementById('timeSaved').textContent = formatTimeSaved(timeSaved);

        results.style.display = 'block';
        updateChart(standardLoan.amortization, extraLoan.amortization);
    });

    // Initial Page Load
    setLanguage('en');
});