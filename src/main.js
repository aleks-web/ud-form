import './assets/js/utils.js';
import './main.scss';

document.addEventListener('DOMContentLoaded', (e) => {
    document.addEventListener('click', (e) => {
        const ag = e.target.closest('.agree');
        const input = ag?.querySelector('[type="checkbox"]');

        if (!ag) { return }
        if (e.target.closest('a')) { return; }

        if (input.checked) {
            input.checked = false;
            ag.classList.remove('active');
        } else {
            input.checked = true;
            ag.classList.add('active');
        }

        input.dispatchEvent(new Event('input'));
    });
});



document.addEventListener('DOMContentLoaded', (e) => {
    const form = document.querySelector('form.rev-form');

    if (localStorage.getItem('rev-form')) {
        form.classList.add('rev-form__success');
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const fstServiceGroup = document.querySelector('[name="fst-service"]').closest('.rating-group');
        const fstService = fstServiceGroup.querySelector('input[type="radio"]:checked')?.value;

        const fstRecGroup = document.querySelector('[name="fst-rec"]').closest('.rating-group');
        const fstRec = fstRecGroup.querySelector('input[type="radio"]:checked')?.value;

        const fstWorkGroups = document.querySelector('[name="fst-work"]').closest('.rating-group');
        const fstWork = fstWorkGroups.querySelector('input[type="radio"]:checked')?.value;

        formData.append('fst_rating', fstService);
        formData.append('fst_rec', fstRec);
        formData.append('fst_work', fstWork);

        let url = '';
        if (window.location.host === 'ultradent72.ru') {
            url = 'https://api.tech-ud72.ru/mainsite/?city=72';
        } else {
            url = 'https://api.tech-ud72.ru/mainsite/?city=66';
        }

        const result = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: "same-origin"
        });

        try {
            const jsonResult = await result.json();

            if (jsonResult.success) {
                form.classList.add('rev-form__success');
                localStorage.setItem('rev-form', 'success');
                document.querySelector('.loading')?.remove();
            } else {
                form.classList.remove('rev-form__success');
                localStorage.removeItem('rev-form');
                document.querySelector('.loading')?.remove();
            }
        } catch (e) {
            form.classList.remove('rev-form__success');
            localStorage.removeItem('rev-form');
            document.querySelector('.loading')?.remove();
        }
    }
});


document.addEventListener('DOMContentLoaded', (e) => {
    document.querySelector('.rev-form-more__current').addEventListener('click', (e) => {
       const more = document.querySelector('.rev-form-more');
        more.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', (e) => {
    const inputsStars = document.querySelectorAll('.rev-form-step-2 input[type="radio"]');
    inputsStars.forEach(el => {
        const main = el.closest('.rating-group').querySelector('.fst-main');

        if (!el.classList.contains('.fst-main')) {
            el.addEventListener('input', (e) => {
                main.value = el.value;
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', (e) => {
    const next = document.querySelector('.rev-form-next');
    const prev = document.querySelector('.rev-form-prev');
    const submitBtn = document.querySelector('.rev-form-btns button[type="submit"]');
    const steps = document.querySelectorAll('.rev-form-step');

    function nextStep () {
        let nextStepNum;
        steps.forEach(el => {
            if (el.classList.contains('active')) { nextStepNum = Number(el.dataset.id) + 1; }
            el.classList.remove('active');
        });

        const nextStep = document.querySelector(`.rev-form-step[data-id="${nextStepNum}"]`);

        if (nextStep) {
            nextStep.classList.add('active');
        }

        updateTabs();
        validate();
    }

    function prevStep () {
        let prevStepNum;
        steps.forEach(el => {
            if (el.classList.contains('active')) { prevStepNum = Number(el.dataset.id) - 1; }
            el.classList.remove('active');
        });

        const prevStep = document.querySelector(`.rev-form-step[data-id="${prevStepNum}"]`);

        if (prevStep) {
            prevStep.classList.add('active');
        }

        next.style.display = 'flex';
        submitBtn.style.display = 'none';

        updateTabs();
        validate();
    }

    function getCurrentStep() {
        const steps = document.querySelectorAll('.rev-form-step');
        for (let step of steps) {
            if (step.classList.contains('active')) {
                return step;
            }
        }

        return false;
    }

    function updateTabs() {
        const tabs = document.querySelectorAll('.rev-form__step');
        const curStep = getCurrentStep()?.dataset.id;

        tabs.forEach(el => {
            el.classList.remove('active');

            if (Number(el.dataset.id) <= Number(curStep)) {
                el.classList.add('active');
            }
        });
    }

    next.addEventListener('click', (e) => { e.preventDefault(); nextStep(); });
    prev.addEventListener('click', (e) => { e.preventDefault(); prevStep(); });

    document.querySelector('.rev-form')?.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', validate);
        el.addEventListener('change', validate);
    });

    function validate() {
        const username = document.querySelector('input[name="username"]');
        const phone = document.querySelector('input[name="phone"]');
        const doctor = document.querySelector('input[name="doctor"]');
        const currentStep = getCurrentStep();
        const currentStepNum = currentStep?.dataset.id ? Number(getCurrentStep()?.dataset.id) : false;

        switch (currentStepNum) {
            case 1:
                if (username.value && phone.value && doctor.value) {
                    next.classList.remove('disable');
                } else {
                    next.classList.add('disable');
                }
                break;
            case 2:
                const fstServ = document.querySelector('input[name="fst-service"].fst-main');
                const fstWork = document.querySelector('input[name="fst-work"].fst-main');
                const fstRec = document.querySelector('input[name="fst-rec"].fst-main');

                if (fstServ.value != 0 && fstWork.value != 0 && fstRec.value != 0) {
                    next.classList.remove('disable');
                } else {
                    next.classList.add('disable');
                }
                break;
            case 3:
                next.style.display = 'none';
                submitBtn.style.display = 'flex';
            default:
                next.classList.add('disable');
        }
    }

    validate();
});