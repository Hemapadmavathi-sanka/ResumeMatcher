package com.hema.resumematcher.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class ResumeParsingService {

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) throws java.io.IOException, org.apache.tika.exception.TikaException {
        // Tika automatically detects the file type (PDF, DOCX, etc.)
        return tika.parseToString(file.getInputStream());
    }
}
