package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Service
import org.springframework.util.StringUtils
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import java.net.MalformedURLException
import java.nio.file.*
import java.util.stream.Stream
import javax.servlet.ServletContext

@Service
class MediaService {
    private val rootDir: String by lazy {
        FileSystems.getDefault()
                .getPath(System.getProperty("java.io.tmpdir"))
                .toAbsolutePath()
                .toString()
    }

    init {
        val rootDirPath = Paths.get(rootDir)
        if(!Files.isDirectory(rootDirPath)) {
            try {
                Files.createDirectories(rootDirPath)
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

            Files.copy(file.inputStream, Paths.get(rootDir + File.separator + filename),
                    StandardCopyOption.REPLACE_EXISTING)
        } catch (e: Exception) {
            e.printStackTrace()
            throw Anket0rooResponseEntityExceptionHandler.FileRetrievalException("Could not store the file. Error: " + e.message)
        }
    }

    fun load(filename: String): Resource {
        return try {
            val file: Path = Paths.get(rootDir + File.separator + filename)
            val resource: Resource = UrlResource(file.toUri())
            println("File path: ${file.fileName}")
            println("file exists: ${resource.exists()}")
            println("file readable: ${resource.isReadable}")
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