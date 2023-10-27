import React, { useEffect, useRef } from "react";
import "./Editor.scss";
import ACTIONS from "../../Action";
import { useParams } from "react-router-dom";
import Codemirror from "codemirror";
import 'codemirror/mode/javascript/javascript';

//modes
//import addons
// import "codemirror/addon/hint/show-hint";
// import "codemirror/addon/hint/javascript-hint";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

export default function Editor({ socketRef, codeRef,  handleCodeChange}) {
  const editorRef = useRef(null);
  const { roomId } = useParams();

  const init = async () => {
    const textArea = document.getElementById("realTimeCodeEditor");
    // Initialize CodeMirror instance
    //editorRef.current = window.CodeMirror.fromTextArea(textArea, {
    editorRef.current = Codemirror.fromTextArea(textArea, {
      mode: { name: "javascript", json: true },
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      spellcheck: true,
      matchTags: { bothTags: true }, // Highlight matching HTML tags
      matchBrackets: true, // Highlight matching brackets
    });


    editorRef.current.on("change", (instance, changes) => {
      //console.log(changes)
      const { origin, text } = changes;
      const code = instance.getValue();
      codeRef.current = code
      handleCodeChange(code)
      if (origin !== "setValue") {
        socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });
  };

  useEffect(() => {
    init();
    // Cleanup function to destroy CodeMirror instance
    return () => {
      if (editorRef && editorRef.current) {
        editorRef.current.toTextArea();
      }
    };
  }, []);

  useEffect(() => {
    socketRef.current?.on(ACTIONS.CODE_CHANGE, (code) => {
      if (code != null) {
        editorRef.current.setValue(code);
      }
    })
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <textarea name="" id="realTimeCodeEditor" cols="30" rows="10"></textarea>
  );
}
