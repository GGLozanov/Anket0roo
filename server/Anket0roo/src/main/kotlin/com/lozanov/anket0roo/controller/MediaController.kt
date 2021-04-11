package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.service.MediaService
import com.lozanov.anket0roo.util.isURL
import org.apache.tomcat.util.http.fileupload.IOUtils
import org.springframework.core.io.InputStreamResource
import org.springframework.http.*
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.UriUtils
import java.io.InputStream
import java.net.URI
import javax.activation.FileTypeMap
import javax.script.ScriptEngineManager
import javax.script.ScriptException


@RestController
class MediaController(
    private val mediaService: MediaService
) {
    @Throws(ScriptException::class)
    fun jsUrlEncode(documentName: String): String {
        val scriptEngineManager = ScriptEngineManager()
        val scriptEngine = scriptEngineManager
                .getEngineByName("JavaScript")
        return scriptEngine
                .eval("encodeURIComponent('$documentName')").toString()
    }

    @GetMapping(value = ["${QUESTIONNAIRES_MEDIA_PATH}/{filename}"])
    @ResponseBody
    fun getQuestionFile(@PathVariable filename: String): ResponseEntity<*> {
        println("Fetching file w/ filename ${filename}")

        val file = try {
            URI.create(filename).toASCIIString() // test URI schema validation
            mediaService.load(filename)
        } catch(ex: Exception) {
            mediaService.load(jsUrlEncode(filename)) // exception => encode
        }

        val headers = HttpHeaders()
        val media: ByteArray = org.apache.commons.io.IOUtils.toByteArray(file.inputStream)
        headers.cacheControl = CacheControl.noCache().headerValue
        headers.contentType = MediaType.valueOf(FileTypeMap.getDefaultFileTypeMap().getContentType(file.file))

        return ResponseEntity.ok()
                .headers(headers)
                .body(media)
    }

    companion object {
        const val QUESTIONNAIRES_MEDIA_PATH = "/questions/files"
    }
}