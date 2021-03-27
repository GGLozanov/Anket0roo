package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Service
import org.springframework.util.StringUtils
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.net.MalformedURLException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.stream.Stream


@Service
class MediaService {

    @Value("\${spring.servlet.multipart.location}")
    private val rootDir: String = ""

    private val rootPath: Path = Paths.get(rootDir).toAbsolutePath().normalize()

    init {
        if(!Files.isDirectory(rootPath)) {
            try {
                Files.createDirectories(rootPath)
            } catch(ex: IOException) {
                throw Anket0rooResponseEntityExceptionHandler.InitializationException("Failed to initialise file directory for image upload!")
            }
        }
    }

    protected fun save(file: MultipartFile) {
        try {
            val filename = StringUtils.cleanPath(file.originalFilename
                    ?: throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Original filename for file cannot be null!"))
            if(filename.contains("..")) {
                throw Anket0rooResponseEntityExceptionHandler.FileRetrievalException("Invalid storage path characters found in file!")
            }

            Files.copy(file.inputStream, rootPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING)
        } catch (e: Exception) {
            e.printStackTrace()
            throw Anket0rooResponseEntityExceptionHandler.FileRetrievalException("Could not store the file. Error: " + e.message)
        }
    }

    fun load(filename: String): Resource {
        return try {
            val file: Path = rootPath.resolve(filename)
            val resource: Resource = UrlResource(file.toUri())
            if (resource.exists() || resource.isReadable) {
                resource
            } else {
                throw Anket0rooResponseEntityExceptionHandler.FileRetrievalException("Could not read the file or file does not exist!")
            }
        } catch (e: MalformedURLException) {
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Error: " + e.message)
        }
    }
}