import { type ASTNode } from './parser';

export function isValidFunctionName(value: ASTNode['value']): value is keyof typeof funcNameMap {
    return typeof value === 'string' && value in funcNameMap;
}

/*

    function_name: [
        name,
        [
            arg1_name,
            [option1, option1_description, *omit_spec[]],
            [option2, option2_description, *omit_spec[]],
            [REGEX, omit_spec]
            ...
        ],
        [
            arg2_name,
            [option1, option1_description, *omit_spec[]],
            [option2, option2_description, *omit_spec[]],
            ...
        ],
        ...
    ]

    omit_spec:
        arg_i (arg to ignore)
        OR
        [arg_i, suggestion_i[]] (skip list of suggestions for arg)

*/

export const funcNameMap = {
    astronomicalInfo: ['ai', [
        'type',
        ['"sunrise"', 'Today\'s sunrise'],
        ['"sunset"', 'Today\'s sunset'],
        ['"isday"', 'Will return 1 during daylight or 0 if night'],
        ['"nsunrise"', 'Next sunrise'],
        ['"nsunset"', 'Next sunset'],
        ['"mphase"', 'Current Moon phase name'],
        ['"zodiac"', 'Current Zodiac sign name'],
        ['"season"', 'Current Season name'],
        ['"mage"', 'Current Moon age'],
        ['"mill"', 'Current Moon illumination (in percentage)'],
        ['"moonrise"', 'Moon rise'],
        ['"moonset"', 'Moon set'],
        ['"csunrise"', 'Today\'s civil sunrise'],
        ['"csunset"', 'Today\'s civil sunset in hh:mm format'],
        ['"usunrise"', 'Today\'s nautical sunrise'],
        ['"usunset"', 'Today\'s nautical sunset'],
        ['"asunrise"', 'Today\'s astronomical sunrise'],
        ['"asunset"', 'Today\'s astronomical sunset'],
        ['"mphasec"', 'Current Moon phase code, one of: NEW, WAXING_CRESCENT, FIRST_QUARTER, WAXING_GIBBOUS, FULL, WANING_GIBBOUS, THIRD_QUARTER, WANING_CRESCENT'],
        ['"zodiacc"', 'Current Zodiac sign code, one of: ARIES, TAURUS, GEMINI, CANCER, LEO, VIRGO, LIBRA, SCORPIO, SAGITTARIUS, CAPRICORN, AQUARIUS, PISCES'],
        ['"seasonc"', 'Current Season code, one of: SPRING, SUMMER, AUTUMN, WINTER'],
    ], [
        '*date',
        ['"r2d"', '2 days ago'],
        ['"a1d"', 'In 1 day'],
    ]],
    airQuality: ['aq', [
        'type',
        ['"index"', 'Air quality index (0 = best, 400 = worst)'],
        ['"label"', 'Air quality level label'],
        ['"level"', 'Air quality level, one of:: NA, GOOD, MODERATE, UNHEALTHY_FOR_SENSITIVE, UNHEALTHY, VERY_UNHEALTHY, HAZARDOUS'],
        ['"no2"', 'Average No2 (µg/m³)'],
        ['"pm10"', 'Average PM10 (µg/m³)'],
        ['"pm25"', 'Average PM25 (µg/m³)'],
        ['"station"', 'Data station ID'],
        ['"source"', 'Name of the data source'],
        ['"updated"', 'Last data check'],
        ['"collected"', 'Time of data measurement'],
    ]],
    batteryInfo: ['bi', [
        'type',
        ['"level"', 'Battery Level (in %)'],
        ['"temp"', 'Battery Temperature in local unit'],
        ['"tempc"', 'Battery Temperature in celsius'],
        ['"volt"', 'Battery voltage in millivolts'],
        ['"charging"', 'Will return 0 if on battery, 1 if charging'],
        ['"fast"', 'Will return 1 if fast charging, 0 otherwise (Android 5.x or better only)'],
        ['"source"', 'Current power source (Battery, AC, USB or Wireless)'],
        ['"plugged"', 'Time of last plugged / unplugged event'],
        ['"current"', 'Realtime charging/discharging current in milliampere'],
        ['"fullempty"', 'Time of expected next charged/discharged event'],
    ], [
        '*date',
        ['"r30m"', '30 minutes ago (up to 24hr)'],
        ['"r2h"', '2 hours ago (up to 24hr)'],
    ]],
    bitmapPalette: ['bp', [
        'mode',
        ['"muted"', 'Extract muted color'],
        ['"vibrant"', 'Extract vibrant color'],
        ['"dominant"', 'Extract dominant color'],
        ['"mutedbc"', 'Extract muted body text color'],
        ['"vibrantbc"', 'Extract vibrant body text color'],
        ['"mutedtc"', 'Extract muted title text color'],
        ['"vibranttc"', 'Extract vibrant title text color'],
        ['"dmuted"', 'Extract muted dark color'],
        ['"dvibrant"', 'Extract vibrant dark color color'],
        ['"dmutedbc"', 'Extract muted dark body text color'],
        ['"dvibrantbc"', 'Extract vibrant dark body text color'],
        ['"dmutedtc"', 'Extract muted dark title text color'],
        ['"dvibranttc"', 'Extract vibrant dark title text color'],
        ['"lmuted"', 'Extract muted light color'],
        ['"lvibrant"', 'Extract vibrant light color'],
        ['"lmutedbc"', 'Extract muted light body text color'],
        ['"lvibrantbc"', 'Extract vibrant light body text color'],
        ['"lmutedtc"', 'Extract muted light title text color'],
        ['"lvibranttc"', 'Extract vibrant light title text color'],
        ['"dominanttc"', 'Extract dominant title text color'],
        ['"dominantbc"', 'Extract dominant body text color'],
    ], [
        'bitmap',
        ['musicInfo("cover")', 'Music cover art'],
        ['@pic', 'Example global variable bitmap']
    ], [
        '*default',
        ['"#e61919"', 'Red as fallback'],
        ['"#34cf41"', 'Green as fallback'],
        ['"#302adb"', 'Blue as fallback'],
    ]],
    broadcastReceive: ['br', [
        'source',
        ['"kwgt"', 'Will write the value of variable sent from Kustom Widget Flow'],
        ['"tasker"','Will write the value of variable sent from Tasker action plugin'],
        ['"zooper"', 'Will write the value of variable sent to Zooper from Tasker or third party plugins (equivalent in Zooper would be #TFOOBAR#)'],
        ['"remote"', 'Will write the value of variable sent to Kustom via remote message (see remote token in advanced settings of your mobile app)'],
    ], [
        'var',
        ['"foo"', 'Value for broadcasted variable name "foo"'],
        ['"bar"', 'Value for broadcasted variable name "bar"'],
    ]],
    complicationData: ['cd', [
        'id',
        ['1', 'First complication'],
        ['2', 'Second complication'],
        ['3', 'Third complication'],
        ['0', 'Background complication']
    ], [
        'type',
        ['"stext"', 'Small text'],
        ['"ltext"', 'Long text (if available)'],
        ['"icon"', 'Icon'],
        ['"rval"', 'Ranged value'],
        ['"rmin"', 'Ranged min value'],
        ['"rmax"', 'Ranged max value'],
        ['"simg"', 'Small image'],
        ['"limg"', 'Large image'],
        ['"title"', 'Title'],
    ]],
    colorEditor: ['ce', [
        'color',
        ['"#e61919"', 'Red'],
        ['"#34cf41"', 'Green'],
        ['"#302adb"', 'Blue'],
    ], [
        'filter',
        ['"invert"', 'Will invert RGB color'],
        ['"comp"', 'Will return complementary color'],
        ['"contrast"', 'Return either black or white depending on best contrast'],
        ['"alpha"', 'Will set transparency'],
        ['"sat"', 'Will set saturation'],
        ['"lum"', 'Will set luminance'],
        ['"#e61919"', 'Red'],
        ['"#34cf41"', 'Green'],
        ['"#302adb"', 'Blue'],
    ], [
        '*amount',
        ['"20"', '20%'],
        ['"60"', '60%'],
        ['"a50"', 'Add 50%'],
        ['"r50"', 'Remove 50%']
    ]],
    calendarEvents: ['ci', [
        'action',
        ['"title"', 'Title of an event'],
        ['"desc"', 'Description of an event'],
        ['"start"', 'Start date of an event'],
        ['"allday"', 'Will write 1 if an event is allday, 0 otherwise'],
        ['"loc"', 'Location of an event'],
        ['"ccolor"', 'Calendar color for an event'],
        ['"cname"', 'Calendar name for an event'],
        ['"end"', 'End day of an event'],
        ['"color"', 'Color of an event'],
        ['"ecount"', 'Number of events (omits "index" argument)'],
        ['"url"', 'URL of an event'],
        ['"urld"', 'Open calendar of an event (to be used in Touch, Open URL action)']
    ], [
        'index',
        ['0', 'First upcoming event'],
        ['1', 'Second upcoming event'],
        ['"a0"', 'First all day event'],
        ['"a1"', 'Second all day event'],
        ['"e0"', 'Today\'s first non-allday event'],
        ['"e1"', 'Today\'s second non-allday event'],
    ], [
        '*date',
        ['"a1d"', 'In 1 day'],
        ['"r2d"', '2 days ago'],
        ['"2024y10M26d"', '26th of October 2024']
    ], [
        '*calendar',
        ['"My calendar"', 'Example calendar name']
    ]],
    colorMaker: ['cm', [
        '*a',
        ['0', 'Alpha at 0 (transparent)'],
        ['255', 'Alpha at 255 (transparent)'],
    ], [
        'r/h',
        ['0', 'Red at 0 / Hue at 0'],
        ['80', 'Red at 80 / Hue at 80'],
        ['200', 'Red at 200'],
    ], [
        'g/s',
        ['0', 'Green at 0 / Saturation at 0'],
        ['80', 'Green at 80 / Saturation at 80'],
        ['200', 'Green at 200'],
    ], [
        'b/v',
        ['0', 'Blue at 0 / Value at 0'],
        ['80', 'Blue at 80 / Value at 80'],
        ['200', 'Blue at 200'],
    ], [
        '*mode',
        ['"r"', 'ARGB mode (default)'],
        ['"h"', 'AHSV mode'],
    ]],
    dateFormat: ['df', [
        'format',
        ['"h:mm"', 'Hours and minutes with padding zero'],
        ['"hh:mma"', 'Hours with leading zero, minutes and AM/PM marker (if 12h format in use)'],
        ['"d MMM yyyy"', 'Day number, month short name and full year'],
        ['"EEEE"', 'Day name'],
        ['"EEE"', 'Short day name'],
        ['"D"', 'Day of year (number)'],
        ['"w"', 'Week of year'],
        ['"e"', 'Day of the week (number, as per app settings)'],
        ['"f"', 'ISO day of week (number, 1=Monday)'],
    ], [
        '*date',
        ['"a1d"', 'In 1 day'],
        ['"r2d"', '2 days ago'],
        ['"2024y10M26d"', '26th of October 2024']
    ]],
    dateParser: ['dp', [
        'date',
        ['"a1d"', 'In 1 day'],
        ['"r2d"', '2 days ago'],
        ['"2024y10M26d"', '26th of October 2024']
    ], [
        'pattern',
        ['"dd-MM-yyyy"', 'Java Date Time format for day, month, year']
    ]],
    fitnessData: ['fd', [
        'type',
        ['"steps"', 'Steps'],
        ['"cals"', 'Active calories'],
        ['"calsr"', 'Inactive calories'],
        ['"dista"', 'Distance (in local unit)'],
        ['"dist"', 'Distance (in meters)'],
        ['"time"', 'Active time'],
        ['"count"', 'Number of activities today'],
        ['"activity"', 'Activity'],
        ['"hrmax"', 'Max heart rate'],
        ['"hrmin"', 'Min heart rate'],
        ['"hravg"', 'Average heart rate'],
        ['"sleept"', 'Sleep time'],
        ['"elema"', 'Elevation (in local unit)'],
        ['"elemu"', 'Local unit for elevation'],
        ['"floors"', 'Floors climbed']
    ], [
        '*start',
        ['"a1d"', 'In 1 day'],
        ['"r2d"', '2 days ago'],
        ['"2024y10M26d"', '26th of October 2024']
    ], [
        '*end',
        ['"a1d"', 'In 1 day'],
        ['"r2d"', '2 days ago'],
        ['"2024y10M26d"', '26th of October 2024']
    ], [
        '*activity',
        ['"Walking"', '"Walking" activity'],
        ['".*bike.*"', 'Any bike activity (regex)']
    ], [
        '*segment',
        ['0', 'First activity/segment'],
        ['1', 'Second activity/segment'],
        ['-1', 'Last activity/segment']
    ]],
    locationInfo: ['li', [
        'type',
        ['"loc"', 'Current Locality (ex Hill Valley, if available)'],
        ['"country"', 'Current Country Name (ex Iceland, if available)'],
        ['"ccode"', 'Current Country Code (ex US, if available)'],
        ['"addr"', 'Current Address (if available)'],
        ['"admin"', 'Current Admin Area (ex CA, if available)'],
        ['"neigh"', 'Current Neighborhood (if available, locality otherwise)'],
        ['"postal"', 'Current Postal Code (if available)'],
        ['"spd"', 'Current Speed in local unit (kmh/mph if available, 0 otherwise)'],
        ['"spdm"', 'Current Speed in meters per second (if available, 0 otherwise)'],
        ['"spdu"', 'Current Speed unit (kmh/mph)'],
        ['"alt"', 'Altitude in local unit (meters/feet with GPS lock only, 0 otherwise)'],
        ['"altm"', 'Altitude in meters (with GPS lock only, o otherwise)'],
        ['"lat"', 'Latitude'],
        ['"lon"', 'Longitude'],
        ['"lplat"', 'Latitude (low precision ~50m)'],
        ['"lplon"', 'Longitude (low precision ~50m)'],
    ]],
    musicInfo: ['mi', [
        'type',
        ['"album"', 'Current Album (if set)'],
        ['"artist"', 'Current Artist (if set)'],
        ['"title"', 'Current Track Title (if set)'],
        ['"len"', 'Current Track Duration (in seconds)'],
        ['"pos"', 'Current Track Position (in seconds)'],
        ['"vol"', 'Current Music Volume (0 to 100)'],
        ['"percent"', 'Current Track Position (in percentage)'],
        ['"cover"', 'Current Cover Image (to be used in Image module or Background as formula)'],
        ['"package"', 'Current Player Package Name'],
        ['"track"', 'Current track in playlist (if available, to be used with musicQueue (mq))'],
        ['"state"', 'Current Player State, one of:: STOPPED, PAUSED, PLAYING, FORWARDING, REWINDING, SKIPPING_FORWARDS, SKIPPING_BACKWARDS, BUFFERING, ERROR, NONE'],
    ]],
    musicQueue: ['mq', [
        'type',
        ['"title"', 'Track title'],
        ['"sub"', 'Track subtitle'],
        ['"len"', 'Playlist length', [1]]
    ], [
        'index',
        ['musicInfo("track") + 1', 'Next track (if available)'],
        ['musicInfo("track") - 1', 'Previous track (if available)'],
    ]],
    mathUtilities: ['mu', [
        'var',
        ['"ceil"', 'Ceil of value', [[1, [1]]]],
        ['"floor"', 'Floor of value', [[1, [1]]]],
        ['"sqrt"', 'Square root of value', [[1, [1]]]],
        ['"round"', 'Round value to the nearest integer (optionally specify number of decimals)'],
        ['"min"', 'Minimum between specified values', [[1, [0]]]],
        ['"max"', 'Maximum between specified values', [[1, [0]]]],
        ['"abs"', 'Absolute value', [[1, [1]]]],
        ['"cos"', 'Cosine of value', [[1, [1]]]],
        ['"sin"', 'Sine of value', [[1, [1]]]],
        ['"tan"', 'Tangent of value', [[1, [1]]]],
        ['"acos"', 'Inverse cosine of value', [[1, [1]]]],
        ['"asin"', 'Inverse sine of value', [[1, [1]]]],
        ['"atan"', 'Inverse tangent of value', [[1, [1]]]],
        ['"log"', 'Logarithm of value', [[1, [1]]]],
        ['"pow"', 'Value raised to a power (second value)', [[1, [0]]]],
        ['"ln"', 'Natural logarithm of value', [[1, [1]]]],
        ['"rnd"', 'Random number between two values', [[1, [0]]]],
        ['"h2d"', 'Converts a hex value to decimal', [[1, [1]]]],
        ['"d2h"', 'Converts a decimal value to hex', [[1, [1]]]],
    ], [
        '...value',
        ['4', 'Any number value'],
        ['4, 10', 'Any multiple number values'] // specific
    ]],
    networkConnectivity: ['nc', [
        'type',
        ['"csig"', 'Cell signal from 0 to 4 for a SIM'], //*
        ['"operator"', 'Current cell operator for a SIM'], //*
        ['"dtype"', 'Current cellular data connection type (LTE, HSUPA…)', [1]],
        ['"dtypes"', 'Current cellular data connection short type (4G, 3G…)', [1]],
        ['"ssid"', 'Current WiFi SSID (if connected)', [1]],
        ['"wsig"', 'Wifi signal from 0 to 9', [1]],
        ['"csiga"', 'Cell signal level as an asu value between 0..31, 99 is unknown', [1]],
        ['"csigd"', 'Cell signal level in dbm', [1]],
        ['"wrssi"', '	Wifi signal raw (RSSI)', [1]],
        ['"wspeed"', 'Wifi speed in Megabit', [1]],
        ['"bt"', 'Current BlueTooth static, 0 disabled, 1 enabled, 2 connected', [1]],
        ['"acount"', 'Count of currently connected Audio Devices', [1]],
        ['"aname"', 'Name of an audio device'], //*
        ['"aaddr"', 'Address of a BT audio device'], //*
        ['"abatt"', 'Battery of a BT audio device (when supported)'], //*
        ['"airplane"', 'Airplane mode, 0 if disabled, 1 if enabled', [1]],
        ['"simcount"', 'Get current number of active SIMs', [1]],
        ['"ifip"', 'Returns IPv4 of a non loopback interface'], //*
        ['"ifname"', 'Returns name of a non loopback interface'], //*
        ['"cid"', 'Cell ID (CID) from network operator', [1]],
        ['"lac"', 'Location Area Code (LAC) from network operator', [1]],
        ['"carrier"', 'Get operator name for a SIM'], //*
        ['"cell"', 'Current cellular status, one of:: OFF, AIRPLANE, ON, DATA, ROAMING, DATAROAMING', [1]],
        ['"wifi"', 'Current WiFi status, one of:: DISABLED, ENABLED, CONNECTED', [1]]
    ], [
        '*index',
        ['0', 'First entry for csig/operator/aname/aaddr/abatt/ifip/ifname/carrier'], // specific
        ['1', 'Second entry for csig/operator/aname/aaddr/abatt/ifip/ifname/carrier']
    ]],
    systemNotification: ['ni', [
        "selector",
        ['"count"', 'Cancellable notifications count', [1]],
        ['"scount"', 'Persistent notifications count', [1]],
        ['"pcount"', "Notification count for package", [2]],
        ['0', 'First cancellable notification', [1]],
        ['1', 'Second cancellable notification', [1]],
        ['"s0"', 'First persistent notification', [1]],
        ['"s1"', 'Second persistent notification', [1]],
        ['"com.whatsapp"', 'Any package', [1]],
        ['REGEX^(?!("pcount"$)).+$', [1]],
    ], [
        'package',
        ['"com.whatsapp"', 'Any package'],
        ['"com.google.android.gm"', 'Any package'],
    ], [
        'data',
        ['"title"', 'Title'],
        ['"text"', 'Short text'],
        ['"desc"', 'Long text'],
        ['"icon"', 'Icon'],
        ['"bicon"', 'Large icon'],
        ['"count"', 'Lines count'],
        ['"pkg"', 'Package name'],
        ['"app"', 'App name'],
        ['"time"', 'Time since (age)'],
    ]],
    resourceMonitor: ['rm', [
        'type',
        ['"cidle"', 'Current idle cpu in %', [1]],
        ['"cused"', 'Current used (sys + usr) cpu in %', [1]],
        ['"cusr"', 'Current user cpu in %', [1]],
        ['"csys"', 'Current system cpu in %', [1]],
        ['"fmin"', 'Min CPU frequency in Mhz', [1]],
        ['"fmax"', 'Max CPU frequency in Mhz', [1]],
        ['"fcur"', 'Current CPU frequency in Mhz', [1]],
        ['"mtot"', 'Total memory in MB', [1]],
        ['"mfree"', 'Free memory in MB', [1]],
        ['"mused"', 'Used memory in MB', [1]],
        ['"fstot"', 'Total SD FS space in MB'],
        ['"fsfree"', 'Free SD FS space in MB'],
        ['"fsused"', 'Used SD FS space in Mb'],
    ], [
        '*fs',
        ['"int"', 'Internal storage'],
        ['"ext"', 'External storage (default)'],
        ['"/sdcard/external_sd"', 'Path to storage'],
    ]],
    shellCommand: ['sh', [
        'cmd',
        ['"ps | grep \'^u\' | wc -l"', 'Number of user processes'],
        ["cat /proc/cpuinfo | grep Hardware | sed 's/.*: //'", 'Current CPU technology'],
    ], [
        '*timeout',
        ['1', 'One minute (default)'],
        ['5', 'Five minutes'],
        ["1/60", 'One second'],
    ], [
        '*lines',
        ['5', 'Five lines to output at maximum (default)'],
        ['10', 'Ten lines to output at maximum'],
    ]],
    systemInfo: ['si', [
        'type',
        ['"alarmd"', 'Next alarm date', [1]],
        ['"alarmt"', 'Next alarm as original text', [1]],
        ['"alarmon"', 'Alarm switch, return 1 if alarm is set, 0 otherwise', [1]],
        ['"land"', 'Screen Orientation (gives 0 in portrait, 1 if landscape)',  [1]],
        ['"locked"', 'Device Lock (gives 1 if locked, 0 if not)', [1]],
        ['"lmode"', 'Location mode, one of: OFF, SENSORS_ONLY, BATTERY_SAVING, HIGH_ACCURACY, UNKNOWN', [1]],
        ['"boot"', 'Boot time', [1]],
        ['"volr"', 'Ringer volume (0 to 100)', [1]],
        ['"vola"', 'Alarm volume (0 to 100)', [1]],
        ['"ringer"', 'Ringer mode, one of:: NORMAL, SILENT, VIBRATE', [1]],
        ['"darkmode"', 'Returns 1 if system dark mode is on', [1]],
        ['"darkwp"', 'Returns 1 if current wallpaper prefers dark colors', [1]],
        ['"powersave"', 'Returns 1 if system is in power save mode (saving battery)', [1]],
        ['"wpcolor1"', 'Primary color of wallpaper if available, 0 otherwise', [1]],
        ['"wpcolor2"', 'Secondary color of wallpaper if available, 0 otherwise', [1]],
        ['"rwidth"', 'Width of root container (in kustom points)', [1]],
        ['"rheight"', 'Height of root container (in kustom points)', [1]],
        ['"rratio"', 'Aspect ratio of root container (in kustom points)', [1]],
        ['"model"', 'Phone Model', [1]],
        ['"man"', 'Phone Manufacturer', [1]],
        ['"build"', 'ROM Name', [1]],
        ['"aver"', 'Android version number', [1]],
        ['"mindex"', 'Module index in its parent', [[1, [0,1,2,3,4,7,8]]]],
        ['"mcount"', 'Current group module count', [1]],
        ['"lnchname"', 'Name of currently set Launcher', [1]],
        ['"lnchpkg"', 'Pkg of currently set Launcher', [1]],
        ['"pkgname"', 'Give name of an app from a pkg name', [[1, [0,1,2,3,4,5,6]]]],
        ['"pkgver"', 'Gives version name of pkg if specified, of kustom if not', [[1, [0,1,2,3,4,5,6]]]],
        ['"pkgvern"', 'Gives version number of pkg if specified, of kustom if not', [[1, [0,1,2,3,4,5,6]]]],
        ['"system"', 'Pulls a system variable', [[1, [1,2,3,4,5,6,7,8]]]],
        ['"swidth"', 'Width of screen in DPI', [1]],
        ['"sheight"', 'Height of screen in DPI', [1]],
        ['"sdpi"', 'DPI', [1]],
        ['"sdensity"', 'Density (Pixel Per DPI)', [1]],
        ['"skpi"', 'KPI (Pixels per Kustom Point)', [1]],
        ['"wpzoomed"', 'Returns 1 if wallpaper is currently zoomed (ex: app drawer is open)', [1]],
        ['"sysca1"', 'System (MaterialYou) first accent color', [[1, [0,5,6,7,8]]]],
        ['"sysca2"', 'System (MaterialYou) second accent color', [[1, [0,5,6,7,8]]]],
        ['"syscn1"', 'System (MaterialYou) first neutral color', [[1, [0,5,6,7,8]]]],
        ['"syscn2"', 'System (MaterialYou) second neutral color', [[1, [0,5,6,7,8]]]],
    ], [
        '*target', // [1, [0,1,2,3,4,5,6,7,8]]
        ['"screen_brightness"', 'System brightness'], // sysvar
        ['0', 'Tone full white'], // monet
        ['30', '30% tone'],
        ['60', '60% tone'],
        ['100', 'Tone full black'],
        ['0', 'First index (parent)'], // module indexes
        ['1', 'Second index (parent\'s parent)'],
        ['systemInfo("lnchpkg")', 'Currently set launcher package'], // packages
        ['"com.whatsapp"', 'Any package'],
    ]],
    textConverter: ['tc', [
        'mode',
        ['"low"', 'Convert text to lower case', [[1, [2]], 2]],
        ['"up"', 'Convert text to upper case', [[1, [2]], 2]],
        ['"cap"', 'Capitalize words in text', [[1, [2]], 2]],
        ['"cut"', 'Will print only the specified substring', [[1, [2]], [2, [3,4,5,6,7,8,9,10,11,12,13]]]],
        ['"ell"', 'Will ellipsize (so cut and add …) if text is longer than n chars', [[1, [2]], [2, [0,1,2,4,5,6,7,8,9,10,11,12,13]]]],
        ['"count"', 'Count the number of times a set of chars appears in text', [[1, [2]], [2, [0,1,2,3,5,6,7,8,9,10,11,12,13]]]],
        ['"utf"', 'Will render utf code (advanced, for font icons', [[1, [2]], 2]],
        ['"len"', 'Will return the length of text', [[1, [2]], 2]],
        ['"n2w"', 'Converts numbers to words', [[1, [0,1]], 2]],
        ['"ord"', 'Renders ordinal suffix for a number (st, nd, rd, th)', [[1, [0,1]], 2]],
        ['"roman"', 'Converts numbers into Roman numerals', [2]],
        ['"lpad"', 'Will left pad the string to n chars length using the provided string (or 0 by default)', [[2, [0,1,2,3,4,6,7,8,9,10,11,12,13]]]],
        ['"rpad"', 'Will right pad the string to n chars length using the provided string (or 0 by default)', [[2, [0,1,2,3,4,6,7,8,9,10,11,12,13]]]],
        ['"split"', 'Split string by char and prints n-th segment', [[1, [2]], [2, [0,1,2,3,4,5,7,8,9,10,11,12,13]]]],
        ['"reg"', 'Will replace text matching a regexp with a string', [[1, [2]], [2, [0,1,2,3,4,5,6,8,9,10,11,12,13]]]],
        ['"html"', 'Converts HTML text into plain text', [[1, [2]], 2]],
        ['"url"', 'URL encode text using UTF-8 or supplied encoding', [[1, [2]], 2]],
        ['"fmt"', 'Convert text and parameters using JAVA format standard', [[1, [2]], [2, [0,1,2,3,4,5,6,7,9,10,11,12,13]]]],
        ['"nfmt"', 'Converts numbers to proper locale format', [[1, [2]], 2]],
        ['"lines"', 'Return number of lines on a given text', [[1, [2]], 2]],
        ['"json"', 'Parse string as a JSON Path expression and return result', [[1, [2]], [2, [0,1,2,3,4,5,6,7,8,10,11,12,13]]]],
        ['"type"', 'Returns text type of the string, one of:: LATIN, NUMBER, ARABIC, CYRILLIC, GREEK, HIRAGANA, KATAKANA, CJK', [2]],
        ['"asort"', 'Sorts words alphabetically', [[1, [2]], [2, [0,1,2,3,4,5,6,7,8,9,12,13]]]],
        ['"nsort"', 'Sorts numbers numerically', [[1, [2]], [2, [0,1,2,3,4,5,6,7,8,9,10,11]]]],
    ], [
        'text',
        ['"Some text"', 'Any text'],
        ['"fOo BAr"', 'Any text'],
        ['42', 'Any number']
    ], [
        '...params',
        // [1, [2]], 
        // [2, [0,1,2,3,4,5,6,7,8,9,10,11,12,13]]
        ['4', 'Cut at first 4 chars'],
        ['2, 5', 'Cut from first 2 to last 5 chars'],
        ['-2', 'Print last two chars'],
        ['6', 'Cut and ellipsize if string is longer than 6 chars'],
        ['"text"', 'Text to count'],
        ['10, "a"', 'Pad to 10 chars with the string "a"'],
        ['"X", 2', 'Split by string "X" and print chars at position 2'],
        ['"o+", "X"', 'Match regexp "o+" and replace with string "X"'],
        ['3, "foo"', 'Java format specifiers'],
        ['".a"', 'Select key "a" from JSON'],
        ['":"', 'Split chars into a list separated by string ":"'],
        ['":", "desc"', 'Split chars into a list separated by string ":", in a descending order'],
        ['":"', 'Split chars into a list separated by string ":", ordered by extracted numbers'],
        ['":", "desc"', 'Split chars into a list separated by string ":", ordered by extracted numbers, in a descending order'],
    ]],
    timeSpan: ['tf', [
        'date',
        ['batteryInfo("plugged")', 'Time since last battery plugged/unplugged'],
        ['"0h0m0sa1d"', 'Time to midnight'],
        ['"11M07d"', 'Any date'],
    ], [
        '*format',
        ['"hh:mm:ss"', 'Hours:minutes:seconds'],
        ['"M"', 'Minutes'],
        ['"hh"', 'Any format']
    ]],
    trafficStats: ['ts', [
        'type',
        ['"trx"', 'Current download speed'],
        ['"ttx"', 'Current upload speed'],
        ['"mt"', 'Total mobile traffic'],
    ], [
        '*unit',
        ['"a"', 'Automatic (default)'],
        ['"b"', 'Bytes'],
        ['"k"', 'Kilobytes'],
        ['"m"', 'Megabytes'],
    ], [
        '*start',
        ['"r0d"', 'Today'],
        ['"r1d"', 'Tomorrow'],
        ['"1dr1M"', 'First day of month'],
        ['"1dr1d"', 'Last day of month'],
    ], [
        '*end',
        ['"r0d"', 'Today'],
        ['"r1d"', 'Tomorrow'],
        ['"1dr1M"', 'First day of month'],
        ['"1dr1d"', 'Last day of month'],
    ]],
    timerUtilities: ['tu', [
        'mode',
        ['"rnd"', 'Return a random number', [[2, [2,3]]]],
        ['"seq"', 'Goes through a sequence', [[2, [2,3]]]],
        ['"rndimg"', 'Pick a random image', [[2, [0,1]]]],
        ['"rndfile"', 'Pick a random file', [[2, [0,1]]]],
    ], [
        'timer',
        ['1', 'Every minute'],
        ['1/4', 'Every 15 seconds'],
        ['20', 'Every 20 minutes'],
    ], [
        '...target',
        ['10, 20', 'From 10 to 20'],
        ['1, 100', 'From 1 to 100'],
        ['"/sdcard/foo"', 'Directory "/sdcard/foo"'],
        ['"/sdcard/foo", "text"', 'Directory "/sdcard/foo" and only files matching pattern "text"']
    ]],
    unreadCounters: ['uc', [
        'mode',
        ['"sms"', 'Unread SMS count', [[1, [3,4,5,6,7,8]], [2, [1,2,3,4,5,6]]]],
        ['"calls"', 'Missed calls count', [[1, [0,2,5,6,7,8]], [2, [1,2,3,4,5,6]]]],
        ['"gmail"', 'Gmail unread count', [[1, [0,1,2,3,4]], [2, [0]]]],
        ['"whatsapp"', 'Unread WhatsApp conversations', [[1, [0,3,4,5,6,7,8]], [2, [1,2,3,4,5,6]]]]
    ], [
        '*param',
        ['"text"', 'Text content'],
        ['"date"', 'Receive date'],
        ['"from"', 'Sender'],
        ['"num"', 'Caller number'],
        ['"name"', 'Caller name'],
        ['"forums"', 'Forums label'],
        ['"promo"', 'Promotions label'],
        ['"updates"', 'Updates label'],
        ['"social"', 'Social label'],
    ], [
        '*...account',
        ['1', 'Second message'],
        ['1', 'Second account'],
        ['"color"', 'Label color'],
        ['"count"', 'Message count in label'],
        ['"unread"', 'Unread message count in label'],
        ['"count", 1', 'Message count in label for second account'],
        ['"count", "foo"', 'Message count in label for "foo" account'],
    ]],
    weatherForecast: ['wf', [
        'type',
        ['"min"', 'Minimum temperature in local unit'],
        ['"max"', 'Maximum temperature in local unit'],
        ['"cond"', 'Forecast condition'],
        ['"icon"', 'Forecast icon, one of: UNKNOWN, TORNADO, TSTORM, TSHOWER, SHOWER, RAIN, SLEET, LSNOW, SNOW, HAIL, FOG, WINDY, PCLOUDY, MCLOUDY, CLEAR'],
        ['"code"', 'Forecast code, one of: TORNADO, TROPICAL_STORM, HURRICANE, SEVERE_THUNDERSTORMS, THUNDERSTORMS, MIXED_RAIN_SNOW, MIXED_RAIN_SLEET, MIXED_SNOW_SLEET, FREEZING_DRIZZLE, DRIZZLE, FREEZING_RAIN, SHOWERS, HEAVY_SHOWERS, SNOW_FLURRIES, LIGHT_SNOW_SHOWERS, BLOWING_SNOW, SNOW, HAIL, SLEET, DUST, FOGGY, HAZE, SMOKY, BLUSTERY, WINDY, CLOUDY, MOSTLY_CLOUDY, PARTLY_CLOUDY, CLEAR, FAIR, MIXED_RAIN_AND_HAIL, ISOLATED_THUNDERSTORMS, SCATTERED_SHOWERS, HEAVY_SNOW, SCATTERED_SNOW_SHOWERS, THUNDERSHOWERS, SNOW_SHOWERS, ISOLATED_THUNDERSHOWERS, NOT_AVAILABLE'],
        ['"rainc"', 'Chance of rain in percentage (if available)'],
        ['"rain"', 'Precipitations in mm (if available)'],
        ['"temp"', 'Temperature in local unit'],
        ['"start"', 'Hourly forecast validity start'],
        ['"end"', 'Hourly forecast validity end'],
        ['"wchill"', 'Wind chill in local unit'],
        ['"wspeed"', 'Wind Speed in local unit (kmh/mph)'],
        ['"wspeedm"', 'Wind Speed in meters per second'],
        ['"wdir"', 'Wind Direction in degrees'],
        ['"hum"', 'Humidity in percent'],
        ['"clouds"', 'Cloud coverage in percent (if available)'],
        ['"press"', 'Pressure in Millibars'],
        ['"minc"', 'Minimum temperature in Celsius'],
        ['"maxc"', 'Maximum temperature in Celsius'],
    ], [
        'day',
        ['0', 'Today'],
        ['1', 'Tomorrow'],
    ], [
        'hours',
        ['0', 'Next hour'],
        ['3', '3 hours from now']
    ]],
    webGet: ['wg', [
        'url',
        ['"quotes.rest/qod.xml"', 'Any URL'],
        ['"cnet.com/rss/news/"', 'Any URL']
    ], [
        'filter',
        ['"rss"', 'Parse as RSS content'],
        ['"txt"', 'Parse as TXT content'],
        ['"xml"', 'Parse as XML content'],
        ['"url"', 'Parse as URL content'],
        ['"json"', 'Parse as JSON content'],
        ['"reg"', 'Parse as RegExp content'],
        ['"jsoup"', 'Parse as JSoup content']
    ], [
        '*...params',
        ['"//quote"', 'Parse "//quote" for XML XPath'],
        ['"//author"', 'Parse "//author" for XML XPath'],
        ['"title"', 'Get RSS feed title'],
        ['"desc"', 'Get RSS feed description'],
        ['0, "desc"', 'Get RSS feed description for entry 0'],
        ['"cdn.500px.org"', 'Extract first URL matching the pattern'],
        ['"cdn.500px.org", count', 'Number of URLs matching the pattern'],
        ['".ip"', 'Parse ".ip" for JSONPath'],
        ['"[\{"\}]", "X"', 'Regex find expression and replace with "X"'],
        ['"meta[property=og:title]", "content"', 'Read html meta og:title property content on element 0 using a JSoup selector']
    ]],
    currentWeather: ['wi', [
        'type',
        ['"temp"', 'Temperature in local unit'],
        ['"tempu"', 'Local temperature unit'],
        ['"flik"', 'Feels like temperature (heat index) in local unit'],
        ['"dpoint"', 'Dew point in local unit'],
        ['"fpoint"', 'Frost point in local unit'],
        ['"cond"', 'Current weather condition'],
        ['"icon"', 'Current weather icon, one of: UNKNOWN, TORNADO, TSTORM, TSHOWER, SHOWER, RAIN, SLEET, LSNOW, SNOW, HAIL, FOG, WINDY, PCLOUDY, MCLOUDY, CLEAR'],
        ['"code"', 'Current weather code, one of: TORNADO, TROPICAL_STORM, HURRICANE, SEVERE_THUNDERSTORMS, THUNDERSTORMS, MIXED_RAIN_SNOW, MIXED_RAIN_SLEET, MIXED_SNOW_SLEET, FREEZING_DRIZZLE, DRIZZLE, FREEZING_RAIN, SHOWERS, HEAVY_SHOWERS, SNOW_FLURRIES, LIGHT_SNOW_SHOWERS, BLOWING_SNOW, SNOW, HAIL, SLEET, DUST, FOGGY, HAZE, SMOKY, BLUSTERY, WINDY, CLOUDY, MOSTLY_CLOUDY, PARTLY_CLOUDY, CLEAR, FAIR, MIXED_RAIN_AND_HAIL, ISOLATED_THUNDERSTORMS, SCATTERED_SHOWERS, HEAVY_SNOW, SCATTERED_SNOW_SHOWERS, THUNDERSHOWERS, SNOW_SHOWERS, ISOLATED_THUNDERSHOWERS, NOT_AVAILABLE'],
        ['"wspeed"', 'Wind Speed in local unit (kmh/mph)'],
        ['"spdu"', 'Local wind speed unit (kmh/mph)'],
        ['"wspeedm"', 'Wind Speed in meters per second'],
        ['"wchill"', 'Wind chill in local unit'],
        ['"wdir"', 'Wind direction in degrees'],
        ['"press"', 'Current pressure in Millibars'],
        ['"hum"', 'Current humidity in percent'],
        ['"clouds"', 'Current cloud coverage in percent (if available)'],
        ['"uvindex"', 'Current UV index (if available)'],
        ['"tempc"', 'Temperature in Celsius'],
        ['"provider"', 'Weather provider used to fetch data'],
        ['"updated"', 'Time of last weather update'],
        ['"lid"', 'Weather station ID (if available)'],
        ['"pdays"', 'Number of days of forecast'],
        ['"prain"', 'Provider precipitation support, 1 if available, 0 if not'],
        ['"prainc"', 'Provider rain chance support, 1 if available, 0 if not'],
        ['"phours"', 'Number of hours in the hourly forecast (if available)'],
        ['"phstep"', 'Provider length of hourly forecast entries, in hours, usually 1']
    ]],
} as const;

export default class CodeGenerator {
    ast: ASTNode[]; 

    constructor(ast: ASTNode[]) {
        this.ast = ast;
    }

    generate(): string {
        return this.visit_statements(this.ast);
    }

    visit_statements(nodes: ASTNode[]): string {
        return nodes.map((node) => this.visit(node)).join('');
    }

    visit(node: ASTNode, options?: {
        expectIterator: boolean
    }): string {
        if (Array.isArray(node)) {
            return this.visit_statements(node);
        }

        switch (node.node_type) {
            case 'if_statement':
                return this.visit_if_statement(node);
            case 'binary_expression':
                return this.visit_binary_expression(node, options);
            case 'function':
                return this.visit_function_call(node, options);
            case 'var_declaration':
                return this.visit_var_declaration(node);
            case 'local_variable':
            case 'global_variable':
                return this.visit_variable(node);
            case 'number':
                return node.value as string;
            case 'string':
                return this.visit_string(node);
            case 'for_loop':
                return this.visit_for_loop(node);
            case 'null':
                return '';
            default:
                throw new Error(`Unknown AST node type: ${node.node_type}`);
        }
    }

    wrapped_expression(expr: string, block_active: boolean): string {
        return block_active ? expr : `\$${expr}\$`;
    }

    visit_for_loop(node: ASTNode): string {
        const start = this.visit(node.children[0]);
        const end = this.visit(node.children[1]);
        const step = this.visit(node.children[2], { expectIterator: true });
        const separator = this.visit(node.children[3], { expectIterator: true });

        let i = 4;
        const body: string[] = []
        while (node.children.length > i) {
            body.push(this.visit(node.children[i++], { expectIterator: true }));
        }

        return this.wrapped_expression(
            `fl(${start}, ${end}, ${step}, ${body.join('')}${separator.length ? ", " : ""}${separator})`,
            node.block_active
        );
    }

    visit_if_statement(node: ASTNode): string {
        const condition = this.visit(node.value as ASTNode);
        const if_body = this.visit((node.children[0]));
        const else_body = node.children[1] 
            ? this.visit((node.children[1])) 
            : null; 

        if (else_body === null) {
            return this.wrapped_expression(`if(${condition}, ${if_body})`, node.block_active);
        } else {
            return this.wrapped_expression(
                `if(${condition}, ${if_body}, ${else_body})`,
                node.block_active
            );
        }
    }

    visit_binary_expression(node: ASTNode, options?: {
        expectIterator: boolean
    }): string {
        const left = this.visit(node.children[0], options);
        const right = this.visit(node.children[1], options);
        const operatorMap: { [key: string]: string } = {
            EQ: '=',
            NE: '!=',
            AND: '&',
            OR: '|',
            ADD: '+',
            SUB: '-',
            MUL: '*',
            DIV: '/',
            LT: '<',
            GT: '>',
            LE: '<=',
            GE: '>='
        };
        const operator = operatorMap[node.value as string];
        return this.wrapped_expression(`${left} ${operator} ${right}`, node.block_active);
    }

    visit_function_call(node: ASTNode, options?: {
        expectIterator?: boolean
    }): string {
        if (options?.expectIterator && node.value === 'i') {
            return 'i';
        }
        if (!((node.value as string) in funcNameMap)) {
            throw new Error(`Line ${node.line}:${node.column}: Unknown function name: '${node.value}'${
                node.value === 'i' ? "('i' can only be used inside for-loops with basic arithmetic operations)" : ''
            }`);
        }
        let func_name = funcNameMap[node.value as keyof typeof funcNameMap][0];
        const args = node.children.filter(v => v.node_type !== 'omit').map((arg) => this.visit(arg)).join(', ');
        return this.wrapped_expression(`${func_name}(${args})`, node.block_active);
    }

    visit_var_declaration(node: ASTNode): string {
        const var_name = node.value;
        let expr = this.visit(node.children[0]);
        if (node.children[0].node_type === 'string') {
            expr = `"${expr}"`;
        }
        return this.wrapped_expression(`lv("${var_name}", ${expr})`, node.block_active);
    }

    visit_variable(node: ASTNode): string {
        if (node.node_type === 'local_variable')
            return this.wrapped_expression(`#${node.value}`, node.block_active);
        else {
            return this.wrapped_expression(`gv(${node.value})`, node.block_active);
        }
    }

    visit_string(node: ASTNode): string {
        let val = node.value as string;
        if (node.block_active) {
            return `"${JSON.parse(val)}"`;
        } else {
            return JSON.parse(val);
        }
    }
}