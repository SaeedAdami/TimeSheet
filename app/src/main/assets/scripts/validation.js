//validation
var validation = {};
validation.isEmpty = function (value) {
    try {
        return value == "" || value.trim() == "";
    } catch (e) {
        console.log(e);
    }
};
validation.isPermitted = function (charCode) {
    try {
        //dot, dash, underscore, @sign
        if (charCode == 46 || charCode == 45 || charCode == 95 || charCode == 64) return true;
        return false;
    } catch (e) {
        console.log(e);
    }
};
validation.isNumeric = function (charCode) {
    try {
        if (charCode > 47 && charCode < 58) return true;
        return false;
    } catch (e) {
        console.log(e);
    }
};
validation.isLetter = function (charCode) {
    try {
        if ((charCode > 96 && charCode < 123) || (charCode > 64 && charCode < 91)) return true;
        return false;
    } catch (e) {
        console.log(e);
    }
};
validation.isHoroof = function (charCode) {
    try {
        if (charCode == 1575 || //alef
                charCode == 1570 || //alef ba kolah
                charCode == 1576 || //be
                charCode == 1662 || //pe
                charCode == 1578 || //te
                charCode == 1579 || //se
                charCode == 1580 || //jim
                charCode == 1670 || //che
                charCode == 1581 || //he
                charCode == 1582 || //khe
                charCode == 1583 || //dal
                charCode == 1584 || //zal
                charCode == 1585 || //raa
                charCode == 1586 || //ze
                charCode == 1688 || //zhe
                charCode == 1587 || //sin
                charCode == 1588 || //shin
                charCode == 1589 || //saad
                charCode == 1590 || //zaa
                charCode == 1591 || //taa
                charCode == 1592 || //zaa
                charCode == 1593 || //ein
                charCode == 1594 || //ghein
                charCode == 1601 || //faa
                charCode == 1602 || //ghe
                charCode == 1705 || //kaaf
                charCode == 1711 || //gaaf
                charCode == 1604 || //laa
                charCode == 1605 || //mim
                charCode == 1606 || //non
                charCode == 1607 || //he
                charCode == 1608 || //vav
                charCode == 1740 || //ye
                charCode == 1616 || //ye arabi
                charCode == 1574 || //hamze
                charCode == 32 || //space
                false) return true;
        return false;
    } catch (e) {
        console.log(e);
    }
};
validation.matchPattern = function (value, pattern) {
    try {
        if (this.isEmpty(value) == true)
            return false;

        for (i = 0; i < value.length; i++) {

            switch (pattern) {
                case "personalcode":
                    if (this.isNumeric(value.charCodeAt(i)) == false) return false;
                    break;
                case "password":
                    if (this.isPermitted(value.charCodeAt(i)) == false &&
                        this.isNumeric(value.charCodeAt(i)) == false &&
                        this.isLetter(value.charCodeAt(i)) == false) return false;
                    break;
                default:
                    return false; //if pattern is not valid
            }
        }

        return true;
    } catch (e) {
        console.log(e);
    }
};
