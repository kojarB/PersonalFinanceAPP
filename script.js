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

    interestRateInput.addEventListener('input', (e) => {
        const input = e.target;
        const currentValue = input.value;
        const originalSelectionStart = input.selectionStart;

        // Normalize commas to dots for consistent processing
        const valueNormalizedCommas = currentValue.replace(/,/g, '.');

        // Sanitize the entire normalized string (only digits and one dot)
        let finalSanitizedValue = '';
        let hasDot = false;
        for (let i = 0; i < valueNormalizedCommas.length; i++) {
            const char = valueNormalizedCommas[i];
            if (char >= '0' && char <= '9') {
                finalSanitizedValue += char;
            } else if (char === '.' && !hasDot) {
                finalSanitizedValue += char;
                hasDot = true;
            }
        }

        // Calculate the new cursor position
        let newCursorPos = 0;
        let relevantCharsBeforeOldCursor = 0;
        // Count "relevant" characters (digits or the first dot) in the
        // *comma-normalized original value* up to the original cursor position.
        hasDot = false; // Reset for this count
        for (let i = 0; i < originalSelectionStart; i++) {
            const char = valueNormalizedCommas[i];
            if (char >= '0' && char <= '9') {
                relevantCharsBeforeOldCursor++;
            } else if (char === '.' && !hasDot) {
                relevantCharsBeforeOldCursor++;
                hasDot = true;
            }
        }

        // Find the position in the *final sanitized value* that corresponds to this count.
        let relevantCharsCountedInNew = 0;
        if (relevantCharsBeforeOldCursor > 0) {
            hasDot = false; // Reset for this scan
            for (let i = 0; i < finalSanitizedValue.length; i++) {
                const char = finalSanitizedValue[i];
                if (char >= '0' && char <= '9') {
                    relevantCharsCountedInNew++;
                } else if (char === '.' && !hasDot) {
                    relevantCharsCountedInNew++;
                    hasDot = true;
                }
                newCursorPos = i + 1; 
                if (relevantCharsCountedInNew >= relevantCharsBeforeOldCursor) {
                    break; 
                }
            }
            // If, after iterating through finalSanitizedValue, we haven't matched relevantCharsBeforeOldCursor
            // (e.g., "123a" -> "123", cursor was after "a", relevantCharsBeforeOldCursor=3, relevantCharsCountedInNew will be 3, newCursorPos will be 3)
            // This case should be handled by the loop itself. If relevantCharsBeforeOldCursor is greater than
            // total relevant chars in finalSanitizedValue (e.g. original "1a2b", cursor after b, sanitized "12", relevantCharsBeforeOldCursor=2, newCursorPos will be 2)
            // This means the cursor should be at the end of the sanitized string if all its relevant prefix chars were kept.
             if (relevantCharsCountedInNew < relevantCharsBeforeOldCursor) {
                newCursorPos = finalSanitizedValue.length;
            }

        } else {
            newCursorPos = 0; // If no relevant chars before old cursor, new cursor is at start
        }
        
        if (finalSanitizedValue.length === 0) { // If everything was stripped
            newCursorPos = 0;
        }

        if (input.value !== finalSanitizedValue) {
            input.value = finalSanitizedValue;
        }

        // Defer setting selection range
        requestAnimationFrame(() => {
            input.setSelectionRange(newCursorPos, newCursorPos);
        });
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