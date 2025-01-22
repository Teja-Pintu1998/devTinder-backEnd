commands to connect git
In JavaScript, this depends on how and where the function is invoked, not necessarily where it's defined. And in the case of Mongoose, it’s a special case because:
                Mongoose explicitly invokes the default function at the document level.
                It assigns the this context to the document being created, overriding the typical behavior.