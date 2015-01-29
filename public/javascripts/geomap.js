var map = new Datamap({
    scope: 'usa',
    element: document.getElementById('customerMap'),
    geographyConfig: {
      highlightBorderColor: '#FFFFFF',
      popupTemplate: function(geo, data) {
        $('.state').html(geo.properties.name)
        $('.amount').html(data.donations.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
      },
      highlightBorderWidth: 3
    },

    fills: {
        'Winner': '#1479F0',
        'Very High Concentration': '#077418',
        'High Concentration': '#3C9006',
        'High Medium Concentration': '#C5D200',
        'Low Medium Concentration': '#DB6F00',
        'Low Concentration': '#dd5252',
        defaultFill: '#DDDDDD'
    },
    data:{
    "AZ": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "CO": {
        "fillKey": "High Medium Concentration",
        "donations": Math.floor((Math.random() * 5000) +2500)
    },
    "DE": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "FL": {
        "fillKey": "Winner",
        "donations": 29
    },
    "GA": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "HI": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "ID": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "IL": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "IN": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "IA": {
        "fillKey": "High Medium Concentration",
        "donations": Math.floor((Math.random() * 5000) +2500)
    },
    "KS": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "KY": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "LA": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "MD": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "ME": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "MA": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "MN": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "MI": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "MS": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "MO": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "MT": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "NC": {
        "fillKey": "Low Medium Concentration",
        "donations": 2435
    },
    "NE": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "NV": {
        "fillKey": "Very High Concentration",
        "donations": 30245
    },
    "NH": {
        "fillKey": "High Medium Concentration",
        "donations": Math.floor((Math.random() * 5000) +2500)
    },
    "NJ": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "NY": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "ND": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "NM": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "OH": {
        "fillKey": "UNDECIDED",
        "donations": 32
    },
    "OK": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "OR": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "PA": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "RI": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "SC": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "SD": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "TN": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "TX": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "UT": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "WI": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "VA": {
        "fillKey": "High Medium Concentration",
        "donations": Math.floor((Math.random() * 5000) +2500)
    },
    "VT": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "WA": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "WV": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "WY": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "CA": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "CT": {
        "fillKey": "High Concentration",
        "donations": Math.floor((Math.random() * 10000) + 5000)
    },
    "AK": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "AR": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    },
    "AL": {
        "fillKey": "Low Concentration",
        "donations": Math.floor((Math.random() * 200) + 500)
    }
  }
});

map.labels();