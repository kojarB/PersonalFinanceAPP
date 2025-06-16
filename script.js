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
            locale: 'en-US', // Keep locale for language formatting, but use NOK currency
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
            monthsSooner: 'måneder raskere',
            currency: 'NOK',
            locale: 'nb-NO',
            currencySymbol: 'NOK',
            loanAmountPlaceholder: 'f.eks., 2 500 000',
            interestRatePlaceholder: 'f.eks., 5,4',
            loanTermPlaceholder: 'f.eks., 30',
            extraPaymentPlaceholder: 'f.eks., 200',
            yearSingular: 'år',
            yearPlural: 'år',
            monthSingular: 'måned',
            monthPlural: 'måneder',
            and: 'og'
        }
    };

    let currentLang = 'en';

    // DOM Elements
    const calculateBtn = document.getElementById('calculateBtn');
    const results = document.getElementById('results');
    const loanAmountInput = document.getElementById('loanAmount');
    const extraPaymentInput = document.getElementById('extraPayment');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    let loanChart = null;

    const formatNumber = (numStr) => {
        if (!numStr) return '';
        const sanitized = numStr.toString().replace(/[^0-9]/g, '');
        return sanitized.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const parseNumber = (numStr) => {
        if (!numStr) return 0;
        return parseFloat(numStr.toString().replace(/\s/g, ''));
    };
    
    const parseInterestRate = (rateStr) => {
        if (!rateStr) return 0;
        return parseFloat(rateStr.toString().replace(',', '.'));
    }

    const setLanguage = (lang) => {
        currentLang = lang;
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang][key]) {
                elem.textContent = translations[lang][key];
            }
        });
        document.querySelectorAll('.currency-indicator').forEach(elem => {
            elem.textContent = translations[lang].currencySymbol;
        });

        loanAmountInput.placeholder = translations[lang].loanAmountPlaceholder;
        interestRateInput.placeholder = translations[lang].interestRatePlaceholder;
        loanTermInput.placeholder = translations[lang].loanTermPlaceholder;
        extraPaymentInput.placeholder = translations[lang].extraPaymentPlaceholder;

        if (results.style.display === 'block') {
            calculateBtn.click();
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
        e.target.value = e.target.value.replace(/[^0-9,.]/g, '');
    });

    loanTermInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    const formatCurrency = (amount) => {
        const { locale, currency } = translations[currentLang];
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const calculateMonthlyPayment = (principal, annualRate, years) => {
        const monthlyRate = annualRate / 12 / 100;
        const numPayments = years * 12;
        if (monthlyRate === 0) return principal / numPayments;
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    };

    const calculateAmortization = (principal, annualRate, years, extraPayment = 0) => {
        const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
        let balance = principal;
        let totalInterest = 0;
        let month = 0;
        const amortization = [{ month: 0, balance: balance }];

        while (balance > 0) {
            month++;
            const interest = balance * (annualRate / 12 / 100);
            let principalPayment = monthlyPayment - interest + extraPayment;

            if (balance - principalPayment < 0) {
                totalInterest += interest;
                balance = 0;
            } else {
                balance -= principalPayment;
                totalInterest += interest;
            }
            amortization.push({ month: month, balance: balance });

            if (month > years * 12 * 2) break; // Safety break
        }
        return { monthlyPayment, totalInterest, totalMonths: month, amortization };
    };

    const formatTimeSaved = (months) => {
        const langTranslations = translations[currentLang];
        const years = Math.floor(months / 12);
        const remainingMonths = Math.round(months % 12);
        let result = [];
        if (years > 0) {
            result.push(`${years} ${years > 1 ? langTranslations.yearPlural : langTranslations.yearSingular}`);
        }
        if (remainingMonths > 0) {
            result.push(`${remainingMonths} ${remainingMonths > 1 ? langTranslations.monthPlural : langTranslations.monthSingular}`);
        }
        return result.join(` ${langTranslations.and} `);
    };

    const updateChart = (standardAmortization, extraAmortization) => {
        const ctx = document.getElementById('loanChart').getContext('2d');
        if (loanChart) {
            loanChart.destroy();
        }

        const standardData = standardAmortization.map(p => ({ x: p.month / 12, y: p.balance }));
        const extraData = extraAmortization.map(p => ({ x: p.month / 12, y: p.balance }));

        const maxYears = Math.ceil(standardAmortization[standardAmortization.length - 1].month / 12);

        loanChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Standard Loan Balance',
                    data: standardData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Loan Balance with Extra Payments',
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
                            maxTicksLimit: maxYears < 15 ? maxYears + 1 : 15, // Limit ticks for readability
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