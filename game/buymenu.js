function BuyMenu(options) {
    this.options = options;
    
    this.renderText = function(money) {
        var i = 0;
        var result = '<table id="buy-table">';
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (i % 3 == 0) {
                    if (i != 0) result += '</tr>';
                    result += '<tr>';
                }
                if (money >= options[key]) result += '<td id="' + key + '" class="buy-cell button">' + key + '</td><td class="buy-price">GB' + options[key] + '</td><td></td>';
                else result += '<td class="buy-cell buy-error">' + key + '</td><td class="buy-price buy-error">GB' + options[key] + '</td><td></td>';
                i++;
            }
        }
        return result + '</table>';
    };
}