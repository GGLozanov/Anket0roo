package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.service.MediaService
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable

class MediaController(
    private val mediaService: MediaService
) {
    @GetMapping(value = ["/questions/files/{filename}"])
    fun getQuestionFile(@PathVariable filename: String): ResponseEntity<*> {
        val file = mediaService.load(filename)
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file)
    }
}