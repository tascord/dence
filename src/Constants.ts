export type ContentType =

    // Application
    "application/EDI-X12" |
    "application/EDIFACT" |
    "application/javascript" |
    "application/octet-stream" |
    "application/ogg" |
    "application/pdf" |
    "application/xhtml+xml" |
    "application/x-shockwave-flash" |
    "application/json" |
    "application/ld+json" |
    "application/xml" |
    "application/zip" |
    "application/x-www-form-urlencoded" |

    // Audio
    "audio/mpeg" |
    "audio/x-ms-wma" |
    "audio/vnd.rn-realaudio" |
    "audio/x-wav" |

    // Image
    "image/gif" |
    "image/jpeg" |
    "image/png" |
    "image/tiff" |
    "image/vnd.microsoft.icon" |
    "image/x-icon" |
    "image/vnd.djvu" |
    "image/svg+xml" |

    // Multipart
    "multipart/mixed" |
    "multipart/alternative" |
    "multipart/related" |
    "multipart/form-data" |

    // Text
    "text/css" |
    "text/csv" |
    "text/html" |
    "text/javascript" |
    "text/plain" |
    "text/xml" |

    // Video
    "video/mpeg" |
    "video/mp4" |
    "video/quicktime" |
    "video/x-ms-wmv" |
    "video/x-msvideo" |
    "video/x-flv" |
    "video/webm" |

    // VND
    "application/vnd.oasis.opendocument.text" |
    "application/vnd.oasis.opendocument.spreadsheet" |
    "application/vnd.oasis.opendocument.presentation" |
    "application/vnd.oasis.opendocument.graphics" |
    "application/vnd.ms-excel" |
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" |
    "application/vnd.ms-powerpoint" |
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" |
    "application/msword" |
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" |
    "application/vnd.mozilla.xul+xml";

export type CORSHeaders =
    "Access-Control-Allow-Origin" |
    "Access-Control-Allow-Credentials" |
    "Access-Control-Expose-Headers" |
    "Access-Control-Max-Age" |
    "Access-Control-Allow-Method" |
    "Access-Control-Allow-Headers";