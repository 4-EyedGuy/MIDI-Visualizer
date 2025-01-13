let midiNotes = [];
let currentTime = 0;
const noteSpeed = 2;
const linePosition = 150;
let isPlaying = false;

function setup() {
    createCanvas(600, 400);
    console.log("Tone.js MIDI is ready:", typeof Midi !== "undefined");
    let loadButton = createButton('Upload MIDI');
    loadButton.position(15, 10);
    loadButton.mousePressed(loadMidiFile);

    let playButton = createButton('Play');
    playButton.position(108, 10);
    playButton.mousePressed(togglePlay);
}

function draw() {
    background(0);
    stroke(255);
    line(linePosition, 0, linePosition, height);

    if (isPlaying) {
        currentTime += deltaTime / 1000;
    }

    for (let note of midiNotes) {
        let noteX = linePosition + (note.time - currentTime) * noteSpeed * 100;
        let noteY = height - (note.pitch - 60) * 10;

        if (noteX < 0 || noteX > width) continue;

        fill(abs(noteX - linePosition) < 5 ? 255 : color(255, 0, 0));
        noStroke();
        ellipse(noteX, noteY, 10, 10);
    }
}

function loadMidiFile() {
    let input = createFileInput(handleFile);
    input.hide();
    input.elt.click();
}

function handleFile(file) {
    if (file.type === 'audio/midi' || file.name.endsWith('.mid')) {
        let reader = new FileReader();
        reader.onload = function (event) {
            parseMidi(event.target.result);
        };
        reader.readAsArrayBuffer(file.file);
    } else {
        alert('Please, upload correct MIDI-file (.mid).');
    }
}


function parseMidi(arrayBuffer) {
    const midi = new Midi(arrayBuffer);
    midiNotes = [];

    console.log(`Found tracks: ${midi.tracks.length}`);

    midi.tracks.forEach((track, index) => {
        console.log(`Track ${index + 1}: Notes: ${track.notes.length}`);
        track.notes.forEach(note => {
            midiNotes.push({
                time: note.time,
                duration: note.duration,
                pitch: note.midi
            });
        });
    });
    console.log(`Notes uploaded: ${midiNotes.length}`);
    currentTime = 0;
}

function togglePlay() {
    isPlaying = !isPlaying;
}
