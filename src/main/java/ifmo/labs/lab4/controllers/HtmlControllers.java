package ifmo.labs.lab4.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HtmlControllers {
    private final Logger logger = LoggerFactory.getLogger(HtmlControllers.class);

    @RequestMapping(value="/")
    public String index(){
        logger.info("Connection to root.");
        return "index";
    }

    @RequestMapping(value = "/main")
    public String main(){
        logger.info("Connection to main.");
        return "index";
    }
}
