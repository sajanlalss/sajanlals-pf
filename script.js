document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.querySelector('.terminal-body');
    const commandLines = document.querySelectorAll('.command-line');
    const outputs = document.querySelectorAll('.output');
    const finalPrompt = document.getElementById('final-prompt');

    // Hide everything initially
    commandLines.forEach(cl => cl.style.display = 'none');
    outputs.forEach(o => {
        o.classList.remove('visible');
        o.style.display = 'none';
    });
    if (finalPrompt) finalPrompt.style.display = 'none';

    async function typeWriter(text, element, speed = 40) {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text.charAt(i);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            await new Promise(res => setTimeout(res, speed));
        }
    }

    async function runSequence() {
        const cmdLinesArray = Array.from(commandLines);

        for (let i = 0; i < cmdLinesArray.length - (finalPrompt ? 0 : 0); i++) {
            const cmdLine = cmdLinesArray[i];
            const commandSpan = cmdLine.querySelector('.command');
            const commandText = commandSpan ? commandSpan.getAttribute('data-cmd') : null;

            if (commandLineIsPartOfFinalPrompt(cmdLine)) continue;

            // Show command line
            cmdLine.style.display = 'flex';

            // Type the command if it exists
            if (commandSpan && commandText) {
                await typeWriter(commandText, commandSpan);
                await new Promise(res => setTimeout(res, 400)); // Pause after typing
            }

            // Show corresponding output
            const output = outputs[i];
            if (output) {
                output.style.display = 'block';
                // Trigger CSS transition
                setTimeout(() => {
                    output.classList.add('visible');
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }, 50);
                await new Promise(res => setTimeout(res, 800)); // Pause after output
            }
        }

        // Show final persistent prompt
        if (finalPrompt) {
            finalPrompt.style.display = 'block';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    function commandLineIsPartOfFinalPrompt(el) {
        return el.closest('#final-prompt') !== null;
    }

    // Start the sequence after a small delay
    setTimeout(runSequence, 1000);
});
