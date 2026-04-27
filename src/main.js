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

        const result = await fetch('/revform/revform.php', {
            method: 'POST',
            body: formData,
            credentials: "same-origin"
        });

        try {
            const jsonResult = await result.json();

            if (jsonResult.success) {
                form.classList.add('rev-form__success');
                localStorage.setItem('rev-form', 'success');
            } else {
                form.classList.remove('rev-form__success');
                localStorage.removeItem('rev-form');
            }
        } catch (e) {
            form.classList.remove('rev-form__success');
            localStorage.removeItem('rev-form');
        }
    }
});