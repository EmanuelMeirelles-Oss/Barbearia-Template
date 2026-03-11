// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- BOOKING SYSTEM LOGIC ---
    
    // Mock Data for the white-label template
    const services = [
        { id: 's1', name: 'Corte Clássico', price: 55, duration: '40 min', icon: 'fa-scissors', desc: 'Lavagem e finalização' },
        { id: 's2', name: 'Barba Tradicional', price: 45, duration: '30 min', icon: 'fa-mattress-pillow', desc: 'Toalha quente e navalha' },
        { id: 's3', name: 'Corte & Barba Premium', price: 90, duration: '1h 15m', icon: 'fa-crown', desc: 'Pacote completo' }
    ];

    const barbers = [
        { id: 'b1', name: 'Alex Silva', exp: 'Especialista em Degradê', img: 'https://ui-avatars.com/api/?name=Alex+Silva&background=D4AF37&color=000&size=100' },
        { id: 'b2', name: 'Bruno Costa', exp: 'Mestre em Barboterapia', img: 'https://ui-avatars.com/api/?name=Bruno+Costa&background=D4AF37&color=000&size=100' },
        { id: 'b3', name: 'Carlos Men', exp: 'Cortes Clássicos', img: 'https://ui-avatars.com/api/?name=Carlos+Men&background=D4AF37&color=000&size=100' }
    ];

    // State Management
    let state = {
        step: 1,
        service: null,
        barber: null,
        date: null,
        time: null,
        userName: '',
        userPhone: ''
    };

    const container = document.getElementById('booking-container');
    const stepsUI = document.querySelectorAll('.step');

    function updateStepsUI() {
        stepsUI.forEach((el) => {
            const stepNum = parseInt(el.getAttribute('data-step'));
            el.classList.remove('active', 'completed');
            if (stepNum < state.step) {
                el.classList.add('completed');
            } else if (stepNum === state.step) {
                el.classList.add('active');
            }
        });
        
        // Update connecting lines
        document.querySelectorAll('.step-line').forEach((line, index) => {
            if (index < state.step - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }

    function renderStep1() {
        let html = `<div class="step-content">
            <h3 style="margin-bottom: 20px; text-align: center;">Selecione o Serviço</h3>
            <div class="selection-grid">`;
        
        services.forEach(s => {
            const isSelected = state.service?.id === s.id ? 'selected' : '';
            html += `
                <div class="selectable-card ${isSelected}" onclick="window.selectService('${s.id}')">
                    <i class="fa-solid ${s.icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                    <h4 style="margin-bottom: 5px;">${s.name}</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">${s.desc}</p>
                    <div style="color: var(--primary-color); font-weight: 600;">R$ ${s.price}</div>
                </div>
            `;
        });
        
        html += `</div>
            <div class="booking-footer" style="justify-content: flex-end;">
                <button class="btn btn-primary" onclick="window.nextStep()" ${!state.service ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                    Próximo <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>`;
        
        container.innerHTML = html;
        updateStepsUI();
    }

    function renderStep2() {
        let html = `<div class="step-content">
            <h3 style="margin-bottom: 20px; text-align: center;">Escolha o Profissional</h3>
            <div class="selection-grid">`;
        
        barbers.forEach(b => {
            const isSelected = state.barber?.id === b.id ? 'selected' : '';
            html += `
                <div class="selectable-card ${isSelected}" onclick="window.selectBarber('${b.id}')">
                    <img src="${b.img}" alt="${b.name}" class="barber-img">
                    <h4 style="margin-bottom: 5px;">${b.name}</h4>
                    <p style="color: var(--text-muted); font-size: 0.85rem;">${b.exp}</p>
                </div>
            `;
        });
        
        html += `
                <div class="selectable-card ${state.barber?.id === 'any' ? 'selected' : ''}" onclick="window.selectBarber('any')">
                    <div class="barber-img" style="display:inline-flex; align-items:center; justify-content:center; background:rgba(212,175,55,0.1); border:2px dashed var(--primary-color);">
                        <i class="fa-solid fa-user-group" style="color:var(--primary-color); font-size: 1.5rem;"></i>
                    </div>
                    <h4 style="margin-bottom: 5px;">Qualquer Barbeiro</h4>
                    <p style="color: var(--text-muted); font-size: 0.85rem;">Primeiro disponível</p>
                </div>
            </div>
            <div class="booking-footer">
                <button class="btn btn-outline" onclick="window.prevStep()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                <button class="btn btn-primary" onclick="window.nextStep()" ${!state.barber ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                    Próximo <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>`;
        
        container.innerHTML = html;
        updateStepsUI();
    }

    function renderStep3() {
        // Generate mock dates for the next 7 days
        const dates = [];
        const today = new Date();
        const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
        const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        
        for(let i=1; i<=7; i++) {
            let d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push({
                full: d.toISOString().split('T')[0],
                dayNum: d.getDate(),
                dayStr: diasSemana[d.getDay()],
                month: meses[d.getMonth()]
            });
        }

        const times = ['09:00', '10:00', '11:00', '13:30', '14:30', '16:00', '17:00', '18:30', '19:30'];

        let html = `<div class="step-content">
            <h3 style="margin-bottom: 20px;">Data do Agendamento</h3>
            <div class="date-selector">`;
            
        dates.forEach(d => {
            const isSelected = state.date === d.full ? 'selected' : '';
            html += `
                <div class="date-card ${isSelected}" onclick="window.selectDate('${d.full}')">
                    <span class="day-name">${d.dayStr}</span>
                    <span class="day-num">${d.dayNum}</span>
                    <span class="month">${d.month}</span>
                </div>
            `;
        });
            
        html += `</div>
            <h3 style="margin-bottom: 15px; margin-top: 30px;">Horário Disponível</h3>
            <div class="time-grid">
        `;

        if(state.date) {
            times.forEach(t => {
                const isSelected = state.time === t ? 'selected' : '';
                // Randomly disable some slots to look real
                const isAvailable = Math.random() > 0.3; 
                if (isAvailable || isSelected) {
                    html += `<button class="time-btn ${isSelected}" onclick="window.selectTime('${t}')">${t}</button>`;
                } else {
                    html += `<button class="time-btn" disabled style="opacity:0.3; text-decoration:line-through; cursor:not-allowed;">${t}</button>`;
                }
            });
        } else {
            html += `<p style="color:var(--text-muted); grid-column: 1/-1;">Selecione uma data acima para ver os horários disponíveis.</p>`;
        }

        html += `</div>
            <div class="booking-footer">
                <button class="btn btn-outline" onclick="window.prevStep()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                <button class="btn btn-primary" onclick="window.nextStep()" ${!(state.date && state.time) ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                    Próximo <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>`;

        container.innerHTML = html;
        updateStepsUI();
    }

    function renderStep4() {
        let html = `<div class="step-content">
            <h3 style="margin-bottom: 25px; text-align: center;">Confirme seu Agendamento</h3>
            
            <div class="summary-box">
                <div class="summary-item">
                    <span style="color:var(--text-muted)">Serviço</span>
                    <strong>${state.service.name} (${state.service.duration})</strong>
                </div>
                <div class="summary-item">
                    <span style="color:var(--text-muted)">Profissional</span>
                    <strong>${state.barber.name}</strong>
                </div>
                <div class="summary-item">
                    <span style="color:var(--text-muted)">Data / Hora</span>
                    <strong>${state.date.split('-').reverse().join('/')} às ${state.time}</strong>
                </div>
                <div class="summary-item summary-total">
                    <span>Total a pagar no local</span>
                    <span>R$ ${state.service.price}</span>
                </div>
            </div>

            <div style="max-width: 500px; margin: 0 auto;">
                <div class="form-group">
                    <label>Seu Nome Completo</label>
                    <input type="text" id="clientName" class="form-input" placeholder="Ex: João da Silva" value="${state.userName}" onkeyup="window.updateInput('userName', this.value)">
                </div>
                <div class="form-group">
                    <label>Seu WhatsApp</label>
                    <input type="tel" id="clientPhone" class="form-input" placeholder="(11) 99999-9999" value="${state.userPhone}" onkeyup="window.updateInput('userPhone', this.value)">
                </div>
            </div>

            <div class="booking-footer">
                <button class="btn btn-outline" onclick="window.prevStep()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                <button class="btn btn-primary" onclick="window.finishBooking()" style="background-color:#25D366; color:#000; border:none;">
                    Confirmar via WhatsApp <i class="fa-brands fa-whatsapp"></i>
                </button>
            </div>
        </div>`;

        container.innerHTML = html;
        updateStepsUI();
    }

    // Global Functions for the onclick handlers
    window.selectService = (id) => {
        state.service = services.find(s => s.id === id);
        renderStep1();
    };

    window.selectBarber = (id) => {
        if (id === 'any') {
            state.barber = { id: 'any', name: 'Qualquer Barbeiro' };
        } else {
            state.barber = barbers.find(b => b.id === id);
        }
        renderStep2();
    };

    window.selectDate = (date) => {
        state.date = date;
        state.time = null; // reset time when date changes
        renderStep3();
    };

    window.selectTime = (time) => {
        state.time = time;
        renderStep3();
    };

    window.updateInput = (field, value) => {
        state[field] = value;
    };

    window.nextStep = () => {
        if (state.step < 4) {
            state.step++;
            routeStep();
        }
    };

    window.prevStep = () => {
        if (state.step > 1) {
            state.step--;
            routeStep();
        }
    };

    window.finishBooking = () => {
        if (!state.userName || !state.userPhone) {
            alert("Por favor, preencha seu nome e WhatsApp para confirmar.");
            return;
        }

        // WhatsApp Checkout Logic (White-label default behavior)
        const phone = "5511999999999"; // Estabelecimento phone (Can be configured)
        const text = `*NOVO AGENDAMENTO!* %0A%0A` +
                     `*Cliente:* ${state.userName} %0A` +
                     `*Telefone:* ${state.userPhone} %0A` +
                     `*Serviço:* ${state.service.name} %0A` +
                     `*Barbeiro:* ${state.barber.name} %0A` +
                     `*Data:* ${state.date.split('-').reverse().join('/')} %0A` +
                     `*Horário:* ${state.time} %0A` +
                     `*Total Estimado:* R$ ${state.service.price} %0A%0A` +
                     `_Agendamento gerado pelo site._`;

        const url = `https://wa.me/${phone}?text=${text}`;
        
        // Show success animation maybe, then redirect
        container.innerHTML = `
            <div class="step-content text-center" style="padding: 60px 20px;">
                <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: #25D366; margin-bottom: 20px;"></i>
                <h2>Redirecionando...</h2>
                <p style="color:var(--text-muted); margin-top:10px;">Enviando confirmação para o WhatsApp da barbearia.</p>
            </div>
        `;
        
        setTimeout(() => {
            window.open(url, '_blank');
            // Reset after booking
            state = { step: 1, service: null, barber: null, date: null, time: null, userName: '', userPhone: '' };
            routeStep();
        }, 2000);
    };

    function routeStep() {
        switch(state.step) {
            case 1: renderStep1(); break;
            case 2: renderStep2(); break;
            case 3: renderStep3(); break;
            case 4: renderStep4(); break;
        }
    }

    // Initialize the booking UI
    routeStep();

});
