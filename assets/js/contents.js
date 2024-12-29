document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-item');

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                submenu.classList.toggle('open');
            }
        });
    });
});
