// PHQ-9 Progress Chart
document.addEventListener('DOMContentLoaded', function() {
    const chartCanvas = document.getElementById('phq9-chart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 0', 'Week 2', 'Week 4', 'Week 6', 'Week 8', 'Week 10', 'Week 12'],
                datasets: [{
                    label: 'PHQ-9 Score',
                    data: [16, 14, 12, 10, 9, 8, 8],
                    borderColor: '#2A9D8F',
                    backgroundColor: 'rgba(42, 157, 143, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: '#2A9D8F',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#14213D',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 10,
                        cornerRadius: 5
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5,
                            font: {
                                size: 12
                            }
                        },
                        title: {
                            display: true,
                            text: 'PHQ-9 Score',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        chartCanvas.style.height = '300px';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// PHQ-9 Score Calculator
function calculatePHQ9() {
    const form = document.getElementById('phq9-form');
    if (!form) return;
    
    let totalScore = 0;
    const questions = form.querySelectorAll('input[type="radio"]:checked');
    
    questions.forEach(question => {
        totalScore += parseInt(question.value);
    });
    
    return {
        score: totalScore,
        severity: getPHQ9Severity(totalScore)
    };
}

function getPHQ9Severity(score) {
    if (score >= 0 && score <= 4) return 'Minimal depression';
    if (score >= 5 && score <= 9) return 'Mild depression';
    if (score >= 10 && score <= 14) return 'Moderate depression';
    if (score >= 15 && score <= 19) return 'Moderately severe depression';
    if (score >= 20) return 'Severe depression';
    return 'Invalid score';
}

// GAD-7 Score Calculator
function calculateGAD7() {
    const form = document.getElementById('gad7-form');
    if (!form) return;
    
    let totalScore = 0;
    const questions = form.querySelectorAll('input[type="radio"]:checked');
    
    questions.forEach(question => {
        totalScore += parseInt(question.value);
    });
    
    return {
        score: totalScore,
        severity: getGAD7Severity(totalScore)
    };
}

function getGAD7Severity(score) {
    if (score >= 0 && score <= 4) return 'Minimal anxiety';
    if (score >= 5 && score <= 9) return 'Mild anxiety';
    if (score >= 10 && score <= 14) return 'Moderate anxiety';
    if (score >= 15) return 'Severe anxiety';
    return 'Invalid score';
}

// Session storage for form data
function saveFormProgress(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    sessionStorage.setItem(formId, JSON.stringify(data));
}

function loadFormProgress(formId) {
    const savedData = sessionStorage.getItem(formId);
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    const form = document.getElementById(formId);
    
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = data[key];
        }
    });
}

// Stripe integration placeholder
function initializeStripeCheckout() {
    // This would be implemented with actual Stripe keys
    console.log('Stripe checkout initialized');
}

// Calendly integration placeholder
function openCalendlyScheduler(consultationType) {
    // This would open Calendly widget
    console.log(`Opening scheduler for ${consultationType}`);
}