// --- PARTE 1: SETUP INICIAL ---
// Quando a página carrega, já pego os elementos que vou usar várias vezes
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    const modalImage = document.getElementById('modalMainImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalGallery = document.getElementById('modalGallery');

    // --- PARTE 2: FUNÇÃO PRA ABRIR O MODAL ---
    // Essa função é o coração da parada - ela que monta todo o conteúdo do modal
    function openProjectModal(projectData) {
        const modalContent = modal.querySelector('.modal-content');
        modalTitle.innerHTML = ''; // Limpo o título antes de colocar algo novo
        
        // Marco qual tipo de projeto é (ilustração ou audiovisual)
        modalContent.dataset.type = projectData.type || 'illustration';

        // Se o título for uma imagem (tipo um logo), crio uma tag de imagem
        // Se não, só coloco o texto mesmo
        if (projectData.title.toLowerCase().endsWith('.jpg') ||
            projectData.title.toLowerCase().endsWith('.png') ||
            projectData.title.toLowerCase().endsWith('.gif')) {
            const titleImage = document.createElement('img');
            titleImage.src = projectData.title;
            titleImage.alt = 'Logo do projeto';
            titleImage.className = 'project-logo-image';
            modalTitle.appendChild(titleImage);
        } else {
            const titleText = document.createElement('h2');
            titleText.textContent = projectData.title;
            titleText.className = 'project-logo-text';
            modalTitle.appendChild(titleText);
        }

        // Se for um projeto audiovisual, monto a estrutura com vídeo
        if (projectData.type === 'audiovisual') {
            const videoContainer = document.getElementById('modalVideo');
            const audiovisualDescription = document.getElementById('modalAudiovisualDescription');
            const rolesContent = document.getElementById('modalRolesContent');

            videoContainer.innerHTML = projectData.videoEmbed || 'Vídeo';
            audiovisualDescription.textContent = projectData.description || '';
            rolesContent.textContent = projectData.roles || '';
        } else {
            // Se não, monto a estrutura pra ilustração com imagem e galeria
            modalImage.src = projectData.image || '';
            modalImage.alt = projectData.title || 'Projeto';
            modalDescription.textContent = projectData.description || '';

            // Limpo a galeria antes de começar
            modalGallery.innerHTML = '';
            
            // Se tiver galeria, crio os elementos pra cada imagem
            if (projectData.gallery) {
                try {
                    const galleryImages = JSON.parse(projectData.gallery);
                    galleryImages.forEach(imgSrc => {
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item-modal';
                        galleryItem.style.backgroundImage = `url(${imgSrc})`;
                        modalGallery.appendChild(galleryItem);
                    });
                } catch (e) {
                    console.error('Erro ao processar galeria:', e);
                }
            }
        }

        // Mostra o modal e trava o scroll da página
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // --- PARTE 3: EVENTOS DOS CARDS ---
    // Configuro os eventos tanto no link quanto no card inteiro
    document.querySelectorAll('.project-card').forEach(card => {
        const projectLink = card.querySelector('.project-link');

        // Quando clica no link "Veja mais"
        projectLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Pego todos os dados do card e mando pro modal
            const projectData = {
                type: card.dataset.type,
                title: card.dataset.title,
                image: card.dataset.image,
                description: card.dataset.description,
                gallery: card.dataset.gallery,
                videoEmbed: card.dataset.videoEmbed,
                roles: card.dataset.roles
            };
            openProjectModal(projectData);
        });

        // Quando clica em qualquer lugar do card (menos no link)
        card.addEventListener('click', function (e) {
            if (!e.target.closest('.project-link')) {
                const projectData = {
                    type: this.dataset.type,
                    title: this.dataset.title,
                    image: this.dataset.image,
                    description: this.dataset.description,
                    gallery: this.dataset.gallery,
                    videoEmbed: this.dataset.videoEmbed,
                    roles: this.dataset.roles
                };
                openProjectModal(projectData);
            }
        });
    });

    // --- PARTE 4: FECHAR O MODAL ---
    // Fecha quando clica no X
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Fecha quando clica fora do modal
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});