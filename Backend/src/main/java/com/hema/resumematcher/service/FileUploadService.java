package com.hema.resumematcher.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${app.upload.root:uploads}")
    private String uploadRoot;

    public String storeFile(MultipartFile file, String subDir) throws IOException {
        Path root = Paths.get(uploadRoot, subDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID().toString() + extension;
        Path target = root.resolve(fileName);
        Files.copy(file.getInputStream(), target);

        // Return the relative path for web access or the full path for storage
        return fileName;
    }
}
