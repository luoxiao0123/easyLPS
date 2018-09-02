QUnit.test("hello test", function(assert) {
	assert.ok(1 == "1", "Passed!");
});

QUnit.test("condRestrict test", function(assert) {
	var obj = document.createElement("INPUT");
	obj.value = "aA0(),_ @<>=+-*/\\";
	condRestrict(obj);
	assert.ok(obj.value == "aA0(),_ @<>=+-*/\\", "Passed!");
	obj.value = "a"
	condRestrict(obj);
	assert.ok(obj.value == "a", "Passed!");
	obj.value = "a(X)";
	condRestrict(obj);
	assert.ok(obj.value == "a(X)", "Passed!");
	obj.value = "a(X, 0)"
	condRestrict(obj);
	assert.ok(obj.value == "a(X, 0)", "Passed!");
	obj.value = "Z > 3";
	condRestrict(obj);
	assert.ok(obj.value == "Z > 3", "Passed!");
	obj.value = "!#$%^&|'\"?~`"
	condRestrict(obj);
	assert.ok(obj.value == "", "Passed!");
	obj.value = "1 != 2";
	condRestrict(obj);
	assert.ok(obj.value == "1 = 2", "Passed!");
	obj.value = "%1% &= %2%"
	condRestrict(obj);
	assert.ok(obj.value == "1 = 2", "Passed!");
});

QUnit.test("alnumRestrict test", function(assert) {
	var obj = document.createElement("INPUT");
	obj.value = "aA0_";
	alnumRestrict(obj);
	assert.ok(obj.value == "aA0_", "Passed!");
	obj.value = "a"
	alnumRestrict(obj);
	assert.ok(obj.value == "a", "Passed!");
	obj.value = "a(X)";
	alnumRestrict(obj);
	assert.ok(obj.value == "aX", "Passed!");
	obj.value = "a(X, 0)"
	alnumRestrict(obj);
	assert.ok(obj.value == "aX0", "Passed!");
	obj.value = "Z > 3";
	alnumRestrict(obj);
	assert.ok(obj.value == "Z3", "Passed!");
	obj.value = "(), @<>=+-*/\\!#$%^&|'\"?~`"
	alnumRestrict(obj);
	assert.ok(obj.value == "", "Passed!");
	obj.value = "1 != 2";
	alnumRestrict(obj);
	assert.ok(obj.value == "12", "Passed!");
	obj.value = "%1% &= %2%"
	alnumRestrict(obj);
	assert.ok(obj.value == "12", "Passed!");
});


String.prototype.trim = function () { 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
};

String.prototype.isValidName = function() {
	var regex = /^(\s)*[a-z](\w)*(\s)*(\((\s)*(\w)+(\s)*(,(\s)*(\w)+(\s)*)*\))?(\s)*$/;
	return this.match(regex);
}

String.prototype.toStandardForm = function() {
	var strNoSpace = this.replace(/\s+/g, '');
	return strNoSpace.replace(/,/g, ', ');
}

String.prototype.resetBlank = function() {
	 return this.replace(/\s+/g, ' '); 
};

QUnit.test("trim test", function(assert) {
	assert.ok("1".trim() == "1", "Passed!");
	assert.ok(" 1    ".trim() == "1", "Passed!");
	assert.ok(" a b ".trim() == "a b", "Passed!");
	assert.ok("    a     b   ".trim() == "a     b", "Passed!");
});

QUnit.test("resetBlank test", function(assert) {
	assert.ok("1".resetBlank() == "1", "Passed!");
	assert.ok("        ".resetBlank() == " ", "Passed!");
	assert.ok(" 1    ".resetBlank() == " 1 ", "Passed!");
	assert.ok(" a b ".resetBlank() == " a b ", "Passed!");
	assert.ok("    a     b   ".resetBlank() == " a b ", "Passed!");
});

QUnit.test("isValidName test", function(assert) {
	assert.ok(!"1".isValidName(), "Passed!");
	assert.ok(!"        ".isValidName(), "Passed!");
	assert.ok(!" 1    ".isValidName(), "Passed!");
	assert.ok(!" a b ".isValidName(), "Passed!");
	assert.ok(!"    a     b   ".isValidName(), "Passed!");
	assert.ok("     ab    ".isValidName(), "Passed!");
	assert.ok("ab(Xa,Yb)".isValidName(), "Passed!");
	assert.ok("   b  (  Xa ,  Yb   )   ".isValidName(), "Passed!");
	assert.ok("a(0, 0, 0)".isValidName(), "Passed!");
});

QUnit.test("toStandardForm test", function(assert) {
	assert.ok("1".toStandardForm() == "1", "Passed!");
	assert.ok("        ".toStandardForm() == "", "Passed!");
	assert.ok(" 1    ".toStandardForm() == "1", "Passed!");
	assert.ok("     ab    ".toStandardForm() == "ab", "Passed!");
	assert.ok("ab(Xa,Yb)".toStandardForm() == "ab(Xa, Yb)", "Passed!");
	assert.ok("   b  (  Xa ,  Yb   )   ".toStandardForm() == "b(Xa, Yb)", "Passed!");
	assert.ok("   z  (  _ ,  _,  _  , _   )   ".toStandardForm() == "z(_, _, _, _)", "Passed!");
});