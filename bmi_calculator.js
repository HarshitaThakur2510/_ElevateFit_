document.addEventListener('DOMContentLoaded', () => {
    
    // --- BMI Calculator with Modal ---
    const bmiForm = document.getElementById('bmiForm');
    
    // Only run if the form exists on the page
    if (bmiForm) {
        // Get Modal elements
        const modal = document.getElementById('bmiModal');
        const closeBtn = document.querySelector('.close-button');
        const bmiValueElem = document.getElementById('modalBmiValue');
        const bmiStatusElem = document.getElementById('modalBmiStatus');

        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form submission

            const age = parseInt(document.getElementById('age').value);
            let height = parseFloat(document.getElementById('height').value);
            let weight = parseFloat(document.getElementById('weight').value);
            const heightUnit = document.getElementById('heightUnit').value;
            const weightUnit = document.getElementById('weightUnit').value;

            if (isNaN(age) || isNaN(height) || isNaN(weight) || age <= 0 || height <= 0 || weight <= 0) {
                alert("Please enter valid age, height, and weight.");
                return;
            }

            // Convert units to metric
            if (heightUnit === 'in') height *= 0.0254;
            else height /= 100;

            if (weightUnit === 'lbs') weight *= 0.453592;

            // Calculate BMI
            const bmi = weight / (height * height);
            const bmiFormatted = bmi.toFixed(1);

            // Determine Status
            let status = '';
            let statusClass = '';
            if (bmi < 18.5) {
                status = 'Underweight';
                statusClass = 'underweight';
            } else if (bmi <= 24.9) {
                status = 'Normal Weight';
                statusClass = 'normal';
            } else if (bmi <= 29.9) {
                status = 'Overweight';
                statusClass = 'overweight';
            } else {
                status = 'Obese';
                statusClass = 'obese';
            }

            // --- Display Result in Modal ---
            bmiValueElem.textContent = bmiFormatted;
            bmiStatusElem.textContent = status;
            bmiStatusElem.className = ''; // Clear previous classes
            bmiStatusElem.classList.add(statusClass);
            
            modal.style.display = "block"; // Show the modal
        });

        // Close the modal when the user clicks on (x)
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        // Close the modal when the user clicks anywhere outside of the modal
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});