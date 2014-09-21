part of glGame;

List<bool> keys = new List<bool>(256);
List<bool> pkeys = new List<bool>(256);

void initInput() {
	keys.fillRange(0, keys.length, false);
	pkeys.fillRange(0, pkeys.length, false);
	
	window.onKeyDown.listen(onKeyDown);
	window.onKeyUp.listen(onKeyUp);
}

void onKeyDown(KeyboardEvent e) {
	if (e.keyCode < keys.length) {
		if (!keys[e.keyCode]) {
			keys[e.keyCode] = true;
			pkeys[e.keyCode] = true;
		}
	}
}

void onKeyUp(KeyboardEvent e) {
	if (e.keyCode < keys.length) {
		keys[e.keyCode] = false;
	}
}

void updatePKeys() {
	pkeys.fillRange(0, pkeys.length, false);
}

bool keyPressed(int key) => pkeys[key];
bool keyDown(int key) => keys[key];
