package com.maxxton.microdocs.crawler.doclet;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author hermans.s
 */
public class Configuration {

    private static final String OPTION_DIRECTORY = "-d";
    private static final String OPTION_FILENAME = "-f";
    private static final String OPTION_LINKPATH = "-linkpath";
    private static final String OPTION_CRAWLER = "-crawler";
    private static final String DEFAULT_DIRECTORY = ".";
    private static final String DEFAULT_FILENAME = "./microdocs.json";
    private static final String DEFAULT_LINKPATH = "./";
    private static final String DEFAULT_CRAWLER = "spring";

    // List of ignored options
    // TODO: Implement support for these since they are considered standard options
    private static final Map<String, Integer> IGNORED_OPTIONS = new HashMap();

    static {
        IGNORED_OPTIONS.put("-doctitle", 2);
        IGNORED_OPTIONS.put("-windowtitle", 2);
    }

    public String[][] options;

    public String getOutputDirectory() {
        return getOption(OPTION_DIRECTORY) != null ? getOption(OPTION_DIRECTORY) : DEFAULT_DIRECTORY;
    }

    public String getOutputFileName() {
        return getOption(OPTION_FILENAME) != null ? getOption(OPTION_FILENAME) : DEFAULT_FILENAME;
    }

    public String getCrawler() {
        return getOption(OPTION_CRAWLER) != null ? getOption(OPTION_CRAWLER) : DEFAULT_CRAWLER;
    }

    private String getOption(String optionName) {
        for (String[] option : options) {
            if (option[0].equals(optionName)) {
                return option[1];
            }
        }
        return null;
    }

    public int getOptionLength(String option) {
        switch(option){
            case OPTION_DIRECTORY:
            case OPTION_FILENAME:
            case OPTION_LINKPATH:
            case OPTION_CRAWLER:
                return 2;
            default:
                if(IGNORED_OPTIONS.containsKey(option)){
                    return IGNORED_OPTIONS.get(option);
                }else{
                    return 0;
                }
        }
    }
}